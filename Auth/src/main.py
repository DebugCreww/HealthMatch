from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_routes
import os
import uvicorn
from src.db.session import Base, engine

app = FastAPI(
    title="HealthMatch Auth Service",
    description="Microservizio per l'autenticazione degli utenti",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione, limita alle origini specifiche
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includi i router delle API
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Authentication"])

# Creazione delle tabelle del database
Base.metadata.create_all(bind=engine)

@app.get("/status")
async def status():
    """Endpoint per il health check."""
    return {"status": "online", "service": "auth"}

@app.get("/api/v1/status")
async def api_status():
    """Endpoint aggiuntivo per il health check con il prefisso API."""
    return {"status": "online", "service": "auth"}

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8001, reload=True)
