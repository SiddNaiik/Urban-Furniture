from fastapi import FastAPI
from app.db import db_ping
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Urban-Furniture API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok", "database": db_ping()}