from sqlalchemy.orm import Session
from src.models.booking_model import Booking, BookingSchema, BookingUpdateSchema
from src.db.session import get_db

# Funzione per creare una nuova prenotazione
def create_booking(booking: BookingSchema, db: Session = get_db()):
    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking.id

# Funzione per ottenere una prenotazione esistente
def get_booking(booking_id: int, db: Session = get_db()):
    return db.query(Booking).filter(Booking.id == booking_id).first()

# Funzione per aggiornare una prenotazione esistente
def update_booking(booking_id: int, booking_update: BookingUpdateSchema, db: Session = get_db()):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        for key, value in booking_update.dict().items():
            setattr(booking, key, value)
        db.commit()
        db.refresh(booking)
        return True
    return False
