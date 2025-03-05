from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict, Any

from ..models.service_model import (
    Service, Category, Specialty, Professional,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    CategoryCreate, SpecialtyCreate
)

# SERVICES
def create_service(db: Session, service_data: ServiceCreate) -> Service:
    """Crea un nuovo servizio nel database."""
    new_service = Service(
        name=service_data.name,
        description=service_data.description,
        duration=service_data.duration,
        base_price=service_data.base_price
    )
    
    # Aggiungi categorie se specificate
    if service_data.categories:
        for category_id in service_data.categories:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category:
                new_service.categories.append(category)
    
    # Aggiungi specialità se specificate
    if service_data.specialties:
        for specialty_id in service_data.specialties:
            specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
            if specialty:
                new_service.specialties.append(specialty)
    
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

def get_service(db: Session, service_id: int) -> Optional[Service]:
    """Recupera un servizio specifico dal database."""
    return db.query(Service).filter(Service.id == service_id).first()

def get_services(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    specialty: Optional[str] = None,
    category: Optional[str] = None
) -> List[Service]:
    """Recupera un elenco di servizi dal database con filtri opzionali."""
    query = db.query(Service)
    
    # Applicazione dei filtri
    if specialty:
        query = query.join(Service.specialties).filter(Specialty.name == specialty)
    
    if category:
        query = query.join(Service.categories).filter(Category.name == category)
    
    return query.offset(skip).limit(limit).all()

def update_service(db: Session, service_id: int, service_data: ServiceUpdate) -> Optional[Service]:
    """Aggiorna un servizio esistente nel database."""
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        return None
    
    # Aggiorna i campi diretti
    if service_data.name is not None:
        service.name = service_data.name
    if service_data.description is not None:
        service.description = service_data.description
    if service_data.duration is not None:
        service.duration = service_data.duration
    if service_data.base_price is not None:
        service.base_price = service_data.base_price
    
    # Aggiorna categorie se specificate
    if service_data.categories is not None:
        service.categories = []
        for category_id in service_data.categories:
            category = db.query(Category).filter(Category.id == category_id).first()
            if category:
                service.categories.append(category)
    
    # Aggiorna specialità se specificate
    if service_data.specialties is not None:
        service.specialties = []
        for specialty_id in service_data.specialties:
            specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
            if specialty:
                service.specialties.append(specialty)
    
    db.commit()
    db.refresh(service)
    return service

def delete_service(db: Session, service_id: int) -> bool:
    """Elimina un servizio dal database."""
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        return False
    
    db.delete(service)
    db.commit()
    return True

# CATEGORIES
def create_category(db: Session, category_data: CategoryCreate) -> Category:
    """Crea una nuova categoria nel database."""
    new_category = Category(
        name=category_data.name,
        description=category_data.description
    )
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def get_category(db: Session, category_id: int) -> Optional[Category]:
    """Recupera una categoria specifica dal database."""
    return db.query(Category).filter(Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    """Recupera un elenco di categorie dal database."""
    return db.query(Category).offset(skip).limit(limit).all()

# SPECIALTIES
def create_specialty(db: Session, specialty_data: SpecialtyCreate) -> Specialty:
    """Crea una nuova specialità nel database."""
    new_specialty = Specialty(
        name=specialty_data.name,
        description=specialty_data.description
    )
    
    db.add(new_specialty)
    db.commit()
    db.refresh(new_specialty)
    return new_specialty

def get_specialty(db: Session, specialty_id: int) -> Optional[Specialty]:
    """Recupera una specialità specifica dal database."""
    return db.query(Specialty).filter(Specialty.id == specialty_id).first()

def get_specialties(db: Session, skip: int = 0, limit: int = 100) -> List[Specialty]:
    """Recupera un elenco di specialità dal database."""
    return db.query(Specialty).offset(skip).limit(limit).all()

# PROFESSIONALS SERVICES
def get_professional_services(db: Session, professional_id: int) -> List[Service]:
    """Recupera i servizi offerti da un professionista specifico."""
    professional = db.query(Professional).filter(Professional.id == professional_id).first()
    
    if not professional:
        return []
    
    return professional.services

def add_service_to_professional(db: Session, professional_id: int, service_id: int) -> bool:
    """Aggiunge un servizio all'elenco dei servizi offerti da un professionista."""
    professional = db.query(Professional).filter(Professional.id == professional_id).first()
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not professional or not service:
        return False
    
    professional.services.append(service)
    db.commit()
    return True

def remove_service_from_professional(db: Session, professional_id: int, service_id: int) -> bool:
    """Rimuove un servizio dall'elenco dei servizi offerti da un professionista."""
    professional = db.query(Professional).filter(Professional.id == professional_id).first()
    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not professional or not service or service not in professional.services:
        return False
    
    professional.services.remove(service)
    db.commit()
    return True