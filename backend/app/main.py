from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import db_ping
from app.routers import auth, dashboard, users, contacts, products

app = FastAPI(
    title="Urban-Furniture Accounting System API",
    description="Backend API for Urban-Furniture Accounting System",
    version="1.0.0",
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(contacts.router)
app.include_router(products.router)


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/health")
def health():
    return {"status": "ok", "database": db_ping()}