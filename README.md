# Code Guardian

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Code Guardian** is an AI-powered code optimization and analysis tool designed to help developers write better, more secure code. It leverages Google's Gemini AI to provide real-time feedback, flaw detection, and optimization suggestions.

---

## 🚀 Features

- **AI-Powered Optimization**: Utilize Google Gemini AI to analyze and optimize your code.
- **Flaw Detection**: Identify potential security flaws and code smells with precise line number reporting.
- **Detailed History**: Keep track of all your analyses and optimizations with a persistent history log.
- **Secure Authentication**: Robust user authentication system to keep your data private.
- **Interactive Dashboard**: A modern, responsive React-based dashboard for easy interaction.
- **CLI Support**: Toggleable command-line interface for quick checks.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High performance, easy to learn, fast to code, ready for production.
- **Database**: [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database.
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL Toolkit and Object Relational Mapper.
- **AI**: [Google Gemini API](https://deepmind.google/technologies/gemini/) - Next-generation AI models.

### Frontend
- **Framework**: [React](https://react.dev/) - The library for web and native user interfaces.
- **Build Tool**: [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Rapidly build modern websites without ever leaving your HTML.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components built with Radix UI and Tailwind CSS.
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) - Powerful asynchronous state management.

## 📂 Project Structure

```bash
Code_Gaurdian/
├── backend/                # FastAPI backend application
│   ├── .env.example        # Example environment variables
│   ├── main.py             # Application entry point
│   ├── models.py           # Database models
│   ├── security.py         # Authentication logic
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── App.tsx         # Main component
│   └── package.json        # Node.js dependencies
└── README.md               # Project documentation
```

## 🏁 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Google Gemini API Key

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Windows
    python -m venv .venv
    .venv\Scripts\activate

    # macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Copy `.env.example` to `.env` and fill in your details:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    POSTGRES_PASSWORD=your_postgres_password
    # Add other required variables
    ```

5.  **Run migrations:**
    ```bash
    python migrate_add_flaw_report.py
    ```

6.  **Start the server:**
    ```bash
    python main.py
    ```
    The backend will run at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
