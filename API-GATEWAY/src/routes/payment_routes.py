from fastapi import APIRouter, HTTPException, Depends
import httpx
from typing import Dict, Any
from ..auth.jwt_auth import get_current_user, get_current_active_user

router = APIRouter()
PAYMENT_SERVICE_URL = "http://payment-service:8005/api/v1"

@router.post("/create-intent", tags=["Payments"])
async def create_payment_intent(payment_data: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)):
    """Crea un intent di pagamento."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PAYMENT_SERVICE_URL}/stripe/create-payment-intent",
                json={**payment_data, "client_id": current_user["id"]}
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di pagamento non disponibile")

@router.post("/webhook", tags=["Payments"])
async def stripe_webhook(webhook_data: Dict[str, Any]):
    """Gestisce i webhook di Stripe."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PAYMENT_SERVICE_URL}/stripe/webhook",
                json=webhook_data
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di pagamento non disponibile")

@router.get("/methods", tags=["Payments"])
async def get_payment_methods(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Ottiene i metodi di pagamento dell'utente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{PAYMENT_SERVICE_URL}/methods/user/{current_user['id']}"
            )
            
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di pagamento non disponibile")