import bcrypt
import hashlib

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Removed due to incompatibility

def normalize_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def get_password_hash(password: str) -> str:
    normalized = normalize_password(password)
    # bcrypt.hashpw returns bytes, we decode to str for storage
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(normalized.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    normalized = normalize_password(plain_password)
    # bcrypt.checkpw requires bytes for both args
    return bcrypt.checkpw(normalized.encode("utf-8"), hashed_password.encode("utf-8"))
