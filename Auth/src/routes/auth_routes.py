# Correzione 3: src/routes/auth_routes.py
# Questo file risolve i problemi di coerenza tra routes e controller

from fastapi import APIRouter, HTTPException, Depends, Body
from typing import Dict, Any
from ..controllers.auth_controller import login, register, verify, refresh

router = APIRouter()

@router.post("/login")
async def login_route(user_data: Dict[str, Any] = Body(...)):
    """Effettua il login di un utente."""
    result = login(user_data)
    return result

@router.post("/register")
async def register_route(user_data: Dict[str, Any] = Body(...)):
    """Registra un nuovo utente."""
    result = register(user_data)
    return result

@router.post("/verify")
async def verify_token_route(token_data: Dict[str, Any] = Body(...)):
    """Verifica un token JWT."""
    result = verify(token_data)
    return result

@router.post("/refresh")
async def refresh_token_route(token_data: Dict[str, Any] = Body(...)):
    """Rinnova un token JWT."""
    result = refresh(token_data)
    return result