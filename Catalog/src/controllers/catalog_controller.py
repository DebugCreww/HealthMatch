from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.session import get_db
from ..services import catalog_service
from ..models.service_model import (
    ServiceCreate, ServiceUpdate, ServiceResponse,
    CategoryCreate, CategoryResponse,
    SpecialtyCreate, SpecialtyResponse
)

router = APIRouter()

# SERVICES ENDPOINTS
@router.post("/services/", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    """Crea un nuovo servizio."""
    return catalog_service.create_service(db, service)

@router.get("/services/", response_model=List[ServiceResponse])
def get_services(
    skip: int = 0, 
    limit: int = 100,
    specialty: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Recupera l'elenco dei servizi con filtri opzionali."""
    services = catalog_service.get_services(db, skip, limit, specialty, category)
    return services

@router.get("/services/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Recupera un servizio specifico."""
    service = catalog_service.get_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    return service

@router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    """Aggiorna un servizio esistente."""
    updated_service = catalog_service.update_service(db, service_id, service)
    if not updated_service:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    return updated_service

@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    """Elimina un servizio."""
    result = catalog_service.delete_service(db, service_id)
    if not result:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    return {"message": "Servizio eliminato con successo"}

# CATEGORIES ENDPOINTS
@router.post("/categories/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Crea una nuova categoria."""
    return catalog_service.create_category(db, category)

@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Recupera l'elenco delle categorie."""
    categories = catalog_service.get_categories(db, skip, limit)
    return categories

@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Recupera una categoria specifica."""
    category = catalog_service.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Categoria non trovata")
    return category

# SPECIALTIES ENDPOINTS
@router.post("/specialties/", response_model=SpecialtyResponse)
def create_specialty(specialty: SpecialtyCreate, db: Session = Depends(get_db)):
    """Crea una nuova specialità."""
    return catalog_service.create_specialty(db, specialty)

@router.get("/specialties/", response_model=List[SpecialtyResponse])
def get_specialties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Recupera l'elenco delle specialità."""
    specialties = catalog_service.get_specialties(db, skip, limit)
    return specialties

@router.get("/specialties/{specialty_id}", response_model=SpecialtyResponse)
def get_specialty(specialty_id: int, db: Session = Depends(get_db)):
    """Recupera una specialità specifica."""
    specialty = catalog_service.get_specialty(db, specialty_id)
    if not specialty:
        raise HTTPException(status_code=404, detail="Specialità non trovata")
    return specialty

# PROFESSIONAL SERVICES ENDPOINTS
@router.get("/professionals/{professional_id}/services", response_model=List[ServiceResponse])
def get_professional_services(professional_id: int, db: Session = Depends(get_db)):
    """Recupera i servizi offerti da un professionista specifico."""
    services = catalog_service.get_professional_services(db, professional_id)
    return services

@router.post("/professionals/{professional_id}/services/{service_id}")
def add_service_to_professional(professional_id: int, service_id: int, db: Session = Depends(get_db)):
    """Aggiunge un servizio all'elenco dei servizi offerti da un professionista."""
    result = catalog_service.add_service_to_professional(db, professional_id, service_id)
    if not result:
        raise HTTPException(status_code=404, detail="Professionista o servizio non trovato")
    return {"message": "Servizio aggiunto con successo al professionista"}

@router.delete("/professionals/{professional_id}/services/{service_id}")
def remove_service_from_professional(professional_id: int, service_id: int, db: Session = Depends(get_db)):
    """Rimuove un servizio dall'elenco dei servizi offerti da un professionista."""
    result = catalog_service.remove_service_from_professional(db, professional_id, service_id)
    if not result:
        raise HTTPException(status_code=404, detail="Professionista, servizio o associazione non trovata")
    return {"message": "Servizio rimosso con successo dal professionista"}