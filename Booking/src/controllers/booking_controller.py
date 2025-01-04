from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.models.booking_model import BookingSchema, BookingUpdateSchema
from src.services.booking_service import create_booking, get_booking, get_user_bookings, update_booking, delete_booking
from src.db.session import get_db

# Creazione di un router per il controller di prenotazione
router = APIRouter()

# Rotta per creare una nuova prenotazione
@router.post("/bookings/")
def create_new_booking(booking: BookingSchema, db: Session = Depends(get_db)):
    booking_id = create_booking(booking, db)
    if not booking_id:
        raise HTTPException(status_code=400, detail="Unable to create booking")
    return {"message": "Booking created successfully", "booking_id": booking_id}

# Rotta per ottenere i dettagli di una prenotazione esistente
@router.get("/bookings/{booking_id}")
def get_booking_details(booking_id: int, db: Session = Depends(get_db)):
    booking = get_booking(booking_id, db)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# Rotta per ottenere l'elenco delle prenotazioni di un utente
@router.get("/bookings/user/{user_id}")
def get_user_bookings_list(user_id: int, db: Session = Depends(get_db)):
    bookings = get_user_bookings(user_id, db)
    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings found for this user")
    return bookings

# Rotta per aggiornare lo stato di una prenotazione esistente
@router.put("/bookings/{booking_id}")
def update_booking_status(booking_id: int, booking_update: BookingUpdateSchema, db: Session = Depends(get_db)):
    updated = update_booking(booking_id, booking_update, db)
    if not updated:
        raise HTTPException(status_code=400, detail="Unable to update booking")
    return {"message": "Booking updated successfully"}

# Rotta per eliminare una prenotazione esistente
@router.delete("/bookings/{booking_id}")
def delete_booking_record(booking_id: int, db: Session = Depends(get_db)):
    deleted = delete_booking(booking_id, db)
    if not deleted:
        raise HTTPException(status_code=400, detail="Unable to delete booking")
    return {"message": "Booking deleted successfully"}