from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import httpx
from typing import Dict, Any

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
AUTH_SERVICE_URL = "http://auth-service:8001/api/v1"

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Verifica il token JWT e restituisce l'utente corrente."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenziali non valide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/verify",
                json={"token": token}
            )
            
            if response.status_code != 200:
                raise credentials_exception
                
            user_data = response.json()
            if not user_data:
                raise credentials_exception
                
            return user_data
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di autenticazione non disponibile")

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Verifica che l'utente sia attivo."""
    if current_user.get("disabled"):
        raise HTTPException(status_code=400, detail="Utente disabilitato")
    return current_user