# CyberSierra AI App 🧠📊

A full-stack AI-powered web app that allows users to:

- Upload CSV/XLS files
- Preview top N rows
- Ask natural language questions powered by LLMs
- Reuse previous prompts
- Provide feedback to improve LLM performance

> Built with ❤️ using React, FastAPI, PandasAI, and OpenAI.

---

## 🚀 Features

- 📁 Upload CSV/XLS files (multi-upload supported)
- 👀 Preview top N rows from selected files
- 💬 Ask questions in natural language and get responses from the data
- 🔁 Reuse previous prompts from history
- 👍👎 Provide feedback for LLM responses
- ☀️🌑 Toggle between dark and light themes
- 📊 Chart rendering supported (auto-generated plots)

---

## 🧪 Tech Stack

| Frontend            | Backend           | AI Layer         |
|---------------------|-------------------|------------------|
| React + MUI         | FastAPI           | PandasAI         |
| React Router        | Python 3.11+      | OpenAI API       |
| Axios, SweetAlert2  | Uvicorn, Pydantic | DuckDB (via PandasAI) |

---

## 🛠 Installation

### 📍 Pre-requisites

- Node.js (v18+)
- Python (>=3.11 recommended)
- `pip`, `venv`, and `git`

---

### 📦 Backend Setup (FastAPI)

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install requirements
pip install -r requirements.txt

# OR install manually if requirements.txt is missing
pip install fastapi uvicorn pandas openpyxl python-dotenv pandasai pandasai-openai

# Create a .env file
echo "OPENAI_API_KEY=sk-proj-..." > .env

# Start the server
uvicorn main:app --reload
```
App will be running at: http://127.0.0.1:8000

### 💻 Frontend Setup (React)

```bash
cd Frontend
npm install

# Start the React app
npm start
```

Frontend runs at: http://localhost:3000

### ⚙️ API Endpoints (Backend)
Method	Endpoint	Description
POST	/api/upload	Upload one or more files
GET	/api/files	List uploaded files
GET	/api/preview	Get top N rows of a selected file
POST	/api/query	Ask prompt to LLM with file context
POST	/api/feedback	Send feedback on LLM response
GET	/api/history	Retrieve all past prompt responses

### 📘 Bonus Features
- Prompt reuse from history
- User feedback (👍 / 👎)
- Auto-code reveal toggle (for transparency)
- Chart rendering (bar, line, pie auto-inferred)
- Query prefill from preview section

### 🔐 Security Considerations
- .env used to securely store API keys
- .gitignore to prevent pushing data/, venv/, and .env files
- Axios and CORS configured securely
- OpenAI key can be revoked at any time if leaked
- Minimal trusted dependencies in requirements.txt

### 🔐 Notes for Evaluators
- Uses your temporary OpenAI key: sk-proj-...
- Designed with extensibility and security in mind
- LLM errors are gracefully handled with fallback messaging

### 📋 Git Instructions
```bash
# Initialize Git (if not already)
git init
git remote add origin <your-repo-url>

# Don't forget to ignore venv and sensitive files
echo "venv/" >> .gitignore
echo ".env" >> .gitignore
echo "data/" >> .gitignore

# Commit and push
git add .
git commit -m "Initial commit: full-stack AI app"
git push origin main
```
#🚀 Built by Akash Savanur



