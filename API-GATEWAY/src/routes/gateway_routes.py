from fastapi import APIRouter, HTTPException
import httpx

# Creazione di un router per le rotte del gateway
router = APIRouter()

# Rotta per il login tramite il gateway
@router.get("/auth/login")
async def login_via_gateway(username: str, password: str):
    # Creazione di un client HTTP asincrono
    async with httpx.AsyncClient() as client:
        # Invio di una richiesta POST al servizio di autenticazione
        response = await client.post("http://auth-service:8001/auth/login", json={"username": username, "password": password})
        # Se la risposta non è 200, solleva un'eccezione HTTP
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        # Restituisce la risposta JSON
        return response.json()
