from fastapi import APIRouter, HTTPException
import httpx

# Creazione di un router per le rotte relative alle prenotazioni
router = APIRouter()

# URL base del servizio di prenotazione
BASE_URL = "http://booking-service:8000/api/v1/bookings"

# Rotta per creare una nuova prenotazione
@router.post("/")
async def create_booking(booking: dict):
    # Creazione di un client HTTP asincrono
    async with httpx.AsyncClient() as client:
        # Invio di una richiesta POST al servizio di prenotazione
        response = await client.post(f"{BASE_URL}/", json=booking)
        # Se la risposta non è 200, solleva un'eccezione HTTP
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        # Restituisce la risposta JSON
        return response.json()

# Rotta per ottenere i dettagli di una prenotazione esistente
@router.get("/{booking_id}")
async def get_booking(booking_id: int):
    # Creazione di un client HTTP asincrono
    async with httpx.AsyncClient() as client:
        # Invio di una richiesta GET al servizio di prenotazione
        response = await client.get(f"{BASE_URL}/{booking_id}")
        # Se la risposta non è 200, solleva un'eccezione HTTP
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        # Restituisce la risposta JSON
        return response.json()

# Rotta per aggiornare una prenotazione esistente
@router.put("/{booking_id}")
async def update_booking(booking_id: int, booking_update: dict):
    # Creazione di un client HTTP asincrono
    async with httpx.AsyncClient() as client:
        # Invio di una richiesta PUT al servizio di prenotazione
        response = await client.put(f"{BASE_URL}/{booking_id}", json=booking_update)
        # Se la risposta non è 200, solleva un'eccezione HTTP
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        # Restituisce la risposta JSON
        return response.json()
