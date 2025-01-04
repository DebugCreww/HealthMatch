from sqlalchemy.orm import Session
from src.models.booking_model import Booking, BookingSchema, BookingUpdateSchema

# Funzione per creare una nuova prenotazione
def create_booking(booking: BookingSchema, db: Session):
    new_booking = Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking.id

# Funzione per ottenere una prenotazione esistente
def get_booking(booking_id: int, db: Session):
    return db.query(Booking).filter(Booking.id == booking_id).first()

# Funzione per ottenere le prenotazioni di un utente
def get_user_bookings(user_id: int, db: Session):
    return db.query(Booking).filter((Booking.client_id == user_id) | (Booking.professional_id == user_id)).all()

# Funzione per aggiornare una prenotazione esistente
def update_booking(booking_id: int, booking_update: BookingUpdateSchema, db: Session):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        for key, value in booking_update.dict().items():
            setattr(booking, key, value)
        db.commit()
        db.refresh(booking)
        return True
    return False

# Funzione per eliminare una prenotazione esistente
def delete_booking(booking_id: int, db: Session):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
        return True
    return False