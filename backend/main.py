# Standard library imports
import os
import logging
from typing import List, Optional
from datetime import datetime

# Third-party imports
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from sqlalchemy.orm import Session
from sqlalchemy import select
import google.generativeai as genai
from dotenv import load_dotenv

# Local imports
import models
from config import engine, get_db
from security import get_password_hash, verify_password


# -------------------------------------------------
# Configuration & Initialization
# -------------------------------------------------

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Code Optimizer API",
    description="Optimize code using Gemini and store history",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Gemini Configuration
# -------------------------------------------------

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")


# -------------------------------------------------
# Pydantic Schemas
# -------------------------------------------------

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    mobile_number: Optional[str] = Field(
        None, pattern=r"^\+?[1-9]\d{7,14}$"
    )


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    mobile_number: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CodeRequest(BaseModel):
    language: str
    code: str = Field(..., min_length=10)
    include_cli: bool = False
    user_id: Optional[int] = None


class HistoryResponse(BaseModel):
    id: int
    code_snippet: str
    optimized_code: str
    flaw_report: Optional[str]
    language: str
    created_at: datetime

    class Config:
        from_attributes = True


class OptimizationResult(BaseModel):
    optimized_code: str
    flaw_report: str


# -------------------------------------------------
# Auth Endpoints
# -------------------------------------------------

@app.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.scalar(select(models.User).where(models.User.username == user.username)):
        raise HTTPException(400, "Username already exists")

    new_user = models.User(
        username=user.username,
        password_hash=get_password_hash(user.password),
        mobile_number=user.mobile_number,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.scalar(select(models.User).where(models.User.username == user.username))
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return db_user


# -------------------------------------------------
# History
# -------------------------------------------------

@app.get("/history/{user_id}", response_model=List[HistoryResponse])
def get_history(user_id: int, db: Session = Depends(get_db)):
    if not db.scalar(select(models.User.id).where(models.User.id == user_id)):
        raise HTTPException(404, "User not found")

    return db.scalars(
        select(models.History)
        .where(models.History.user_id == user_id)
        .order_by(models.History.created_at.desc())
    ).all()


# -------------------------------------------------
# Optimization Endpoint
# -------------------------------------------------

@app.post("/optimize", response_model=OptimizationResult)
def optimize_code(req: CodeRequest, db: Session = Depends(get_db)):
    cli_instruction = (
        "\nInclude command-line usage examples."
        if req.include_cli
        else ""
    )

    prompt = (
        "You are a senior software engineer performing static code analysis.\n\n"
        "Return EXACTLY two sections.\n\n"
        "RULES FOR FLAW REPORT:\n"
        "- MAX 9 lines\n"
        "- Headings ONLY\n"
        "- Each line must include line ranges like: line 5–10\n"
        "- Format: **Issue Name** — line X–Y\n"
        "- No explanations. No bullets.\n"
        f"{cli_instruction}\n\n"
        "FORMAT:\n\n"
        "---OPTIMIZED CODE---\n"
        "[optimized code only]\n\n"
        "---FLAW REPORT---\n"
        "**Issue name** — line X–Y\n"
        "**Issue name** — line X–Y\n\n"
        "Code:\n"
        f"{req.language}\n"
        f"{req.code}\n"
    )

    try:
        response = gemini_model.generate_content(prompt)
        
        full_response = response.text.strip()
        logger.debug(f"Raw Gemini response: {full_response[:500]}...")
        
        optimized_content = ""
        flaw_report = ""
        
        separators = [
            ("---OPTIMIZED CODE---", "---FLAW REPORT---"),
            ("OPTIMIZED CODE:", "FLAW REPORT:"),
            ("**OPTIMIZED CODE**", "**FLAW REPORT**"),
        ]
        
        parsed = False
        for opt_sep, flaw_sep in separators:
            if opt_sep in full_response and flaw_sep in full_response:
                parts = full_response.split(flaw_sep)
                optimized_part = parts[0].replace(opt_sep, "").strip()
                flaw_report = parts[1].strip()
                
                if optimized_part.startswith("```"):
                    lines = optimized_part.split("\n")
                    if len(lines) > 1 and lines[-1].strip().startswith("```"):
                        optimized_content = "\n".join(lines[1:-1]).strip()
                    else:
                        optimized_content = "\n".join(lines[1:]).strip()
                else:
                    optimized_content = optimized_part
                
                parsed = True
                logger.info(f"Successfully parsed response using separators: {opt_sep} / {flaw_sep}")
                break
        
        if not parsed:
            optimized_content = full_response
            flaw_report = "Unable to extract flaw analysis."
            logger.warning("Failed to parse Gemini response with expected format.")

        if req.user_id:
            user_exists = db.scalar(select(models.User.id).where(models.User.id == req.user_id))
            if user_exists:
                db_history = models.History(
                    user_id=req.user_id,
                    code_snippet=req.code,
                    optimized_code=optimized_content,
                    flaw_report=flaw_report,
                    language=req.language
                )
                db.add(db_history)
                db.commit()
                logger.info(f"Optimization for user {req.user_id} saved to history.")

        return OptimizationResult(
            optimized_code=optimized_content,
            flaw_report=flaw_report
        )
    
    except Exception as e:
        logger.exception(f"Optimization error: {e}")
        raise HTTPException(500, "Code optimization failed")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
