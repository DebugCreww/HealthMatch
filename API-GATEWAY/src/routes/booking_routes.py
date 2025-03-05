from fastapi import APIRouter, HTTPException, Depends, Header
import httpx
from typing import Dict, Any, Optional, List
from ..auth.jwt_auth import get_current_user, get_current_active_user

router = APIRouter()

# URL del servizio di prenotazioni
BOOKING_SERVICE_URL = "http://booking-service:8002/api/v1"

# URL del servizio di pagamento
PAYMENT_SERVICE_URL = "http://payment-service:8005/api/v1"

# URL del servizio di notifiche
NOTIFICATION_SERVICE_URL = "http://notification-service:8004/api/v1"

@router.post("/", response_model=Dict[str, Any], tags=["Bookings"])
async def create_booking(booking_data: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)):
    """Crea una nuova prenotazione."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BOOKING_SERVICE_URL}/bookings",
                json={**booking_data, "client_id": current_user["id"]}
            )
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di prenotazione non disponibile")

@router.get("/{booking_id}", tags=["Bookings"])
async def get_booking(booking_id: int, current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Ottiene i dettagli di una prenotazione."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BOOKING_SERVICE_URL}/bookings/{booking_id}")
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
            
            # Verifica che l'utente sia autorizzato a vedere questa prenotazione
            booking = response.json()
            if booking["client_id"] != current_user["id"] and booking["professional_id"] != current_user["id"]:
                raise HTTPException(status_code=403, detail="Non autorizzato")
                
            return booking
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di prenotazione non disponibile")

@router.delete("/{booking_id}", tags=["Bookings"])
async def cancel_booking(booking_id: int, current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Annulla una prenotazione."""
    try:
        async with httpx.AsyncClient() as client:
            # Prima verifica che l'utente sia autorizzato
            booking_response = await client.get(f"{BOOKING_SERVICE_URL}/bookings/{booking_id}")
            
            if booking_response.status_code != 200:
                raise HTTPException(status_code=booking_response.status_code, detail=booking_response.json())
            
            booking = booking_response.json()
            if booking["client_id"] != current_user["id"] and booking["professional_id"] != current_user["id"]:
                raise HTTPException(status_code=403, detail="Non autorizzato")
            
            # Poi cancella la prenotazione
            response = await client.delete(f"{BOOKING_SERVICE_URL}/bookings/{booking_id}")
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return {"message": "Prenotazione annullata con successo"}
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di prenotazione non disponibile")

@router.get("/user/client", tags=["Bookings"])
async def get_client_bookings(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Ottiene le prenotazioni dell'utente corrente come cliente."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BOOKING_SERVICE_URL}/bookings/client/{current_user['id']}"
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di prenotazione non disponibile")

@router.post("/complete", tags=["Bookings"])
async def create_complete_booking(
    booking_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Crea una prenotazione completa, inclusi pagamento e notifiche.
    
    Questo endpoint orchestrerà l'intero flusso di prenotazione attraverso 
    diversi microservizi.
    """
    try:
        async with httpx.AsyncClient() as client:
            # 1. Verifica disponibilità
            availability_response = await client.get(
                f"{BOOKING_SERVICE_URL}/availability/{booking_data['professional_id']}/check",
                params={
                    "start_datetime": booking_data["date_time"],
                    "end_datetime": booking_data["date_time"]  # il servizio calcolerà la fine in base alla durata
                }
            )
            
            if availability_response.status_code != 200 or not availability_response.json().get("is_available"):
                raise HTTPException(status_code=400, detail="Professionista non disponibile in questo orario")
        
            # 2. Crea la prenotazione
            booking_response = await client.post(
                f"{BOOKING_SERVICE_URL}/bookings/",
                json={
                    "client_id": current_user["id"],
                    "professional_id": booking_data["professional_id"],
                    "service_id": booking_data["service_id"],
                    "date_time": booking_data["date_time"],
                    "notes": booking_data.get("notes")
                }
            )
            
            if booking_response.status_code != 200:
                raise HTTPException(status_code=500, detail="Errore nella creazione della prenotazione")
            
            booking = booking_response.json()
            
            # 3. Crea l'intento di pagamento
            payment_response = await client.post(
                f"{PAYMENT_SERVICE_URL}/stripe/create-payment-intent",
                json={
                    "booking_id": booking["id"],
                    "client_id": current_user["id"],
                    "professional_id": booking_data["professional_id"],
                    "amount": booking_data["amount"],
                    "currency": "EUR",
                    "payment_method_id": booking_data.get("payment_method_id")
                }
            )
            
            if payment_response.status_code != 200:
                # Annulla la prenotazione in caso di errore di pagamento
                await client.delete(f"{BOOKING_SERVICE_URL}/bookings/{booking['id']}")
                raise HTTPException(status_code=500, detail="Errore nella creazione del pagamento")
            
            payment = payment_response.json()
            
            # 4. Invia notifiche
            # Notifica al cliente
            await client.post(
                f"{NOTIFICATION_SERVICE_URL}/notifications",
                json={
                    "recipient_id": current_user["id"],
                    "type": "booking",
                    "title": "Prenotazione confermata",
                    "message": f"La tua prenotazione per {booking_data['service_name']} il {booking_data['date_time']} è stata confermata."
                }
            )
            
            # Notifica al professionista
            await client.post(
                f"{NOTIFICATION_SERVICE_URL}/notifications",
                json={
                    "recipient_id": booking_data["professional_id"],
                    "type": "booking",
                    "title": "Nuova prenotazione",
                    "message": f"Hai una nuova prenotazione per {booking_data['service_name']} il {booking_data['date_time']}."
                }
            )
            
            return {
                "booking": booking,
                "payment": payment,
                "status": "confirmed"
            }
            
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio non disponibile")

@router.get("/", response_model=List[Dict[str, Any]], tags=["Bookings"])
async def get_user_bookings(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Recupera le prenotazioni dell'utente corrente"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BOOKING_SERVICE_URL}/bookings/user/{current_user['id']}"
            )
            if response.status_code >= 400:
                raise HTTPException(status_code=response.status_code, detail=response.json())
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Servizio di prenotazione non disponibile")