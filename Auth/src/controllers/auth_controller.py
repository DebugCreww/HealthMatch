from fastapi import APIRouter, HTTPException
from src.services.auth_service import authenticate_user

# Creazione di un router per il controller di autenticazione
router = APIRouter()

# Rotta per il login
@router.post("/login")
def login(username: str, password: str):
    # Autenticazione dell'utente
    token = authenticate_user(username, password)
    # Se l'autenticazione fallisce, solleva un'eccezione HTTP
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Restituisce il token di accesso
    return {"access_token": token}
