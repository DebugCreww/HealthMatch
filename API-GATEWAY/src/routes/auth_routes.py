from fastapi import APIRouter, HTTPException, Depends
import httpx
from typing import Dict, Any

router = APIRouter()

# URL del servizio di autenticazione
AUTH_SERVICE_URL = "http://auth-service:8001/api/v1"

@router.post("/login")
async def login(user_data: Dict[str, Any]):
    """Effettua il login di un utente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/auth/login", json=user_data)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di autenticazione non disponibile")

@router.post("/register")
async def register(user_data: Dict[str, Any]):
    """Registra un nuovo utente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/auth/register", json=user_data)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di autenticazione non disponibile")

@router.post("/verify-token")
async def verify_token(token_data: Dict[str, Any]):
    """Verifica un token JWT."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/auth/verify", json=token_data)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di autenticazione non disponibile")

@router.post("/refresh-token")
async def refresh_token(token_data: Dict[str, Any]):
    """Rinnova un token JWT."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AUTH_SERVICE_URL}/auth/refresh", json=token_data)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di autenticazione non disponibile")