# Auth/src/middleware/auth_middleware.py
# Implementazione del middleware per l'autenticazione

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.services.auth_service import verify_token
from typing import Optional

# Classe per la gestione del token di autenticazione
security = HTTPBearer()

async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = security):
    """
    Middleware che verifica il token JWT e restituisce i dati dell'utente autenticato.
    Da utilizzare con Depends() per proteggere le route che richiedono autenticazione.
    """
    token = credentials.credentials
    result = verify_token(token)
    
    if result["status"] == "invalid":
        raise HTTPException(
            status_code=401,
            detail="Token di autenticazione non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return result["payload"]

async def get_admin_user(request: Request, credentials: HTTPAuthorizationCredentials = security):
    """
    Middleware che verifica che l'utente sia un amministratore.
    Da utilizzare per route riservate agli amministratori.
    """
    token = credentials.credentials
    result = verify_token(token)
    
    if result["status"] == "invalid":
        raise HTTPException(
            status_code=401,
            detail="Token di autenticazione non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = result["payload"]
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Accesso negato: richiesti privilegi di amministratore",
        )
    
    return payload

async def get_user_by_role(request: Request, required_role: Optional[str] = None, credentials: HTTPAuthorizationCredentials = security):
    """
    Middleware che verifica che l'utente abbia un ruolo specifico.
    Da utilizzare per route riservate a ruoli specifici.
    """
    token = credentials.credentials
    result = verify_token(token)
    
    if result["status"] == "invalid":
        raise HTTPException(
            status_code=401,
            detail="Token di autenticazione non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = result["payload"]
    
    if required_role and payload.get("role") != required_role:
        raise HTTPException(
            status_code=403,
            detail=f"Accesso negato: richiesto ruolo '{required_role}'",
        )
    
    return payload