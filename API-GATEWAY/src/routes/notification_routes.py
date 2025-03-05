from fastapi import APIRouter, Depends, HTTPException
import httpx
from typing import Dict, Any, List
from ..auth.jwt_auth import get_current_user, get_current_active_user

router = APIRouter()
NOTIFICATION_SERVICE_URL = "http://notification-service:8004/api/v1"

@router.get("/", response_model=List[Dict[str, Any]])
async def get_notifications(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera le notifiche dell'utente corrente"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{NOTIFICATION_SERVICE_URL}/notifications/user/{current_user['id']}"
            )
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di notifiche non disponibile")

@router.patch("/{notification_id}/read", tags=["Notifications"])
async def mark_as_read(notification_id: int, current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Segna una notifica come letta."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{NOTIFICATION_SERVICE_URL}/notifications/{notification_id}/read",
                json={"user_id": current_user["id"]}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di notifiche non disponibile")

@router.post("/send", tags=["Notifications"])
async def send_notification(notification_data: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)):
    """Invia una nuova notifica."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NOTIFICATION_SERVICE_URL}/notifications",
                json=notification_data
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di notifiche non disponibile")