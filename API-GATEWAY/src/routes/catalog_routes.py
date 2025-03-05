from fastapi import APIRouter, HTTPException, Depends
import httpx
from typing import Dict, Any, List
from ..auth.jwt_auth import get_current_user

router = APIRouter()
CATALOG_SERVICE_URL = "http://catalog-service:8003/api/v1"

@router.get("/services", tags=["Catalog"])
async def get_services(
    specialty: str = None,
    category: str = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera l'elenco dei servizi."""
    try:
        params = {}
        if specialty:
            params["specialty"] = specialty
        if category:
            params["category"] = category
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CATALOG_SERVICE_URL}/services",
                params=params
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio catalogo non disponibile")

@router.get("/services/{service_id}", tags=["Catalog"])
async def get_service(
    service_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera i dettagli di un servizio specifico."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CATALOG_SERVICE_URL}/services/{service_id}"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio catalogo non disponibile")

@router.get("/specialties", tags=["Catalog"])
async def get_specialties():
    """Recupera l'elenco delle specialità disponibili."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CATALOG_SERVICE_URL}/specialties"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio catalogo non disponibile")

@router.get("/categories", tags=["Catalog"])
async def get_categories():
    """Recupera l'elenco delle categorie di servizi disponibili."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CATALOG_SERVICE_URL}/categories"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio catalogo non disponibile")

@router.get("/professionals/{professional_id}/services", tags=["Catalog"])
async def get_professional_services(
    professional_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera i servizi offerti da un professionista specifico."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CATALOG_SERVICE_URL}/professionals/{professional_id}/services"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio catalogo non disponibile")