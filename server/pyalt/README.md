# Python FastAPI Backend

This folder provides the backend API using FastAPI.

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables as needed (optional):
   - `DATABASE_URL` (defaults to the PostgreSQL URL in `schema.prisma`)
   - `SECRET_KEY` (JWT secret)

## Run

Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available on `http://localhost:8000`.