from fastapi import APIRouter, HTTPException, Depends
from src.services.booking_service import create_booking, get_booking, update_booking
from src.models.booking_model import BookingSchema, BookingUpdateSchema

# Creazione di un router per il controller di prenotazione
router = APIRouter()

# Rotta per creare una nuova prenotazione
@router.post("/bookings/")
def create_new_booking(booking: BookingSchema):
    # Creazione della prenotazione
    booking_id = create_booking(booking)
    # Se la creazione fallisce, solleva un'eccezione HTTP
    if not booking_id:
        raise HTTPException(status_code=400, detail="Unable to create booking")
    # Restituisce l'ID della prenotazione creata
    return {"booking_id": booking_id}

# Rotta per ottenere i dettagli di una prenotazione esistente
@router.get("/bookings/{booking_id}")
def get_booking_details(booking_id: int):
    # Ottenimento della prenotazione
    booking = get_booking(booking_id)
    # Se la prenotazione non esiste, solleva un'eccezione HTTP
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    # Restituisce i dettagli della prenotazione
    return booking

# Rotta per aggiornare una prenotazione esistente
@router.put("/bookings/{booking_id}")
def update_booking_details(booking_id: int, booking_update: BookingUpdateSchema):
    # Aggiornamento della prenotazione
    updated = update_booking(booking_id, booking_update)
    # Se l'aggiornamento fallisce, solleva un'eccezione HTTP
    if not updated:
        raise HTTPException(status_code=400, detail="Unable to update booking")
    # Restituisce un messaggio di successo
    return {"message": "Booking updated successfully"}
