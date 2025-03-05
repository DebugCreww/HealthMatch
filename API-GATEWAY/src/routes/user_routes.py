from fastapi import APIRouter, HTTPException, Depends
import httpx
from typing import Dict, Any, List
from ..auth.jwt_auth import get_current_user, get_current_active_user

router = APIRouter()
USERS_SERVICE_URL = "http://users-service:8006/api/v1"

@router.get("/me", tags=["Users"])
async def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Recupera il profilo dell'utente corrente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USERS_SERVICE_URL}/users/{current_user['id']}"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio utenti non disponibile")

@router.put("/me", tags=["Users"])
async def update_current_user_profile(
    profile_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Aggiorna il profilo dell'utente corrente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{USERS_SERVICE_URL}/users/{current_user['id']}",
                json=profile_data
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio utenti non disponibile")

@router.get("/{user_id}", tags=["Users"])
async def get_user_profile(
    user_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera il profilo di un utente specifico."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USERS_SERVICE_URL}/users/{user_id}"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio utenti non disponibile")

@router.get("/professionals", tags=["Users"])
async def search_professionals(
    specialty: str = None,
    location: str = None,
    rating: float = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Cerca professionisti in base a criteri specifici."""
    try:
        params = {}
        if specialty:
            params["specialty"] = specialty
        if location:
            params["location"] = location
        if rating:
            params["min_rating"] = rating
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USERS_SERVICE_URL}/professionals/search",
                params=params
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio utenti non disponibile")