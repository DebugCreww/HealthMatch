# Correzione 2: src/controllers/auth_controller.py
# Questo file corregge le incoerenze tra il controller e il servizio di autenticazione

from fastapi import APIRouter, HTTPException
from src.services.auth_service import (
    authenticate_user,
    register_user,
    verify_token,
    refresh_token,
)
from pydantic import BaseModel

# Creazione del router
router = APIRouter()

# Schemi per le richieste
class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "client" o "professional"

class LoginSchema(BaseModel):
    email: str
    password: str

class TokenSchema(BaseModel):
    token: str

# Rotta per il login
@router.post("/login")
def login(login_data: LoginSchema):
    """
    API endpoint per effettuare il login.
    """
    # Autenticazione dell'utente
    result = authenticate_user(login_data.email, login_data.password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    # Restituisce il token di accesso
    return result

# Rotta per la registrazione
@router.post("/register")
def register(user_data: RegisterSchema):
    """
    API endpoint per registrare un nuovo utente.
    """
    result = register_user(user_data.name, user_data.email, user_data.password, user_data.role)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

# Rotta per verificare un token
@router.post("/verify")
def verify(token_data: TokenSchema):
    """
    API endpoint per verificare un token JWT.
    """
    result = verify_token(token_data.token)
    if result["status"] == "invalid":
        raise HTTPException(status_code=401, detail="Invalid token")
    return result

# Rotta per il refresh del token
@router.post("/refresh")
def refresh(token_data: TokenSchema):
    """
    API endpoint per rigenerare un token JWT.
    """
    result = refresh_token(token_data.token)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return {"access_token": result}