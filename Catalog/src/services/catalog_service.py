from sqlalchemy.orm import Session
from src.models.service_model import Service
from typing import List, Optional

def create_service(db: Session, name: str, description: str, price: float, category: str) -> int:
    """Crea un nuovo servizio nel catalogo."""
    new_service = Service(name=name, description=description, price=price, category=category)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service.id

def get_services(db: Session) -> List[Service]:
    """Restituisce tutti i servizi disponibili nel catalogo."""
    return db.query(Service).all()

def get_service(db: Session, service_id: int) -> Optional[Service]:
    """Restituisce un servizio specifico per ID."""
    return db.query(Service).filter(Service.id == service_id).first()

def update_service(db: Session, service_id: int, service_data: dict) -> bool:
    """Aggiorna un servizio esistente."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return False
    
    for key, value in service_data.items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    return True

def delete_service(db: Session, service_id: int) -> bool:
    """Elimina un servizio esistente."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return False
    
    db.delete(service)
    db.commit()
    return True

def get_services_by_category(db: Session, category: str) -> List[Service]:
    """Restituisce servizi filtrati per categoria."""
    return db.query(Service).filter(Service.category == category).all()