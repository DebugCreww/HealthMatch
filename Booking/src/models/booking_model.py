from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from datetime import datetime

Base = declarative_base()

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, nullable=False)
    professional_id = Column(Integer, nullable=False)
    service_id = Column(Integer, nullable=False)
    date_time = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, cancelled

# Schema per la validazione dei dati in ingresso/uscita
class BookingSchema(BaseModel):
    client_id: int
    professional_id: int
    service_id: int
    date_time: datetime

class BookingUpdateSchema(BaseModel):
    status: str
