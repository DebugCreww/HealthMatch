from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.sql import func
import os
import datetime
from typing import Optional
from pydantic import BaseModel

# Definizione corretta del percorso assoluto per SQLite
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_FILE = os.path.join(DATA_DIR, "notifications.db")
print(f"Percorso database Notification: {DB_FILE}")

DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, nullable=False, index=True)
    sender_id = Column(Integer, nullable=True)  # Può essere null per notifiche di sistema
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)  # Nota: questo campo deve essere content, non message
    type = Column(String(50), nullable=False, index=True)  # booking_confirmation, reminder, system, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    meta_data = Column(Text, nullable=True)  # JSON serializzato per dati aggiuntivi

# Schemi Pydantic per la validazione e la documentazione API
class NotificationBase(BaseModel):
    recipient_id: int
    title: str
    content: str
    type: str
    sender_id: Optional[int] = None
    meta_data: Optional[str] = None  # Cambiato da metadata a meta_data per coerenza

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime.datetime
    is_read: bool
    read_at: Optional[datetime.datetime] = None
    
    class Config:
        from_attributes = True  # Aggiornato da orm_mode = True

# Crea le tabelle nel database
def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()