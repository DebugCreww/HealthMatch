# Booking/src/models/booking_model.py
# Questo file aggiorna il modello di prenotazione con campi e funzionalità aggiuntive

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field, validator
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

# Creazione della base dichiarativa per SQLAlchemy
Base = declarative_base()

# Definizione del modello Booking
class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, nullable=False)
    professional_id = Column(Integer, nullable=False)
    service_id = Column(Integer, nullable=False)
    date_time = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    payment_intent_id = Column(String, nullable=True)
    payment_status = Column(String, nullable=True)  # pending, paid, refunded, failed
    amount = Column(Integer, nullable=True)  # in centesimi
    
    # Campi aggiunti per migliorare il modello
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_updated_by = Column(Integer, nullable=True)  # ID dell'utente che ha effettuato l'ultima modifica
    notes = Column(Text, nullable=True)  # Note aggiuntive per la prenotazione
    has_reminder_sent = Column(Boolean, default=False)  # Flag per il promemoria
    cancellation_reason = Column(String, nullable=True)  # Motivo dell'annullamento
    followup_scheduled = Column(Boolean, default=False)  # Indica se è stato pianificato un appuntamento di follow-up
    followup_booking_id = Column(Integer, nullable=True)  # ID dell'appuntamento di follow-up
    is_recurring = Column(Boolean, default=False)  # Indica se è un appuntamento ricorrente
    parent_booking_id = Column(Integer, nullable=True)  # Per gli appuntamenti in una serie ricorrente

# Schema per la validazione dei dati in ingresso/uscita
class BookingSchema(BaseModel):
    client_id: int
    professional_id: int
    service_id: int
    date_time: datetime
    notes: Optional[str] = None
    amount: Optional[int] = None  # in centesimi
    is_recurring: Optional[bool] = False
    
    # Validatori
    @validator('date_time')
    def date_time_must_be_future(cls, v):
        if v < datetime.now():
            raise ValueError('La data e ora della prenotazione deve essere nel futuro')
        return v

class BookingUpdateSchema(BaseModel):
    status: Optional[str] = None
    date_time: Optional[datetime] = None
    notes: Optional[str] = None
    payment_status: Optional[str] = None
    cancellation_reason: Optional[str] = None
    
    # Validatore per lo status
    @validator('status')
    def status_must_be_valid(cls, v):
        valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        if v not in valid_statuses:
            raise ValueError(f'Status deve essere uno dei seguenti: {", ".join(valid_statuses)}')
        return v
    
    # Validatore per la data
    @validator('date_time')
    def date_time_must_be_future(cls, v):
        if v and v < datetime.now():
            raise ValueError('La data e ora della prenotazione deve essere nel futuro')
        return v

class BookingResponse(BaseModel):
    id: int
    client_id: int
    professional_id: int
    service_id: int
    date_time: datetime
    status: str
    payment_status: Optional[str] = None
    amount: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    notes: Optional[str] = None
    is_recurring: bool = False
    
    # Se necessario, possiamo aggiungere campi calcolati
    class Config:
        orm_mode = True

# Schema per la risposta dettagliata con informazioni aggiuntive
class BookingDetailResponse(BookingResponse):
    client_name: Optional[str] = None
    professional_name: Optional[str] = None
    service_name: Optional[str] = None
    service_duration: Optional[int] = None  # durata in minuti
    payment_intent_id: Optional[str] = None
    cancellation_reason: Optional[str] = None
    followup_booking_id: Optional[int] = None
    parent_booking_id: Optional[int] = None