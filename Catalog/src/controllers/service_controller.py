from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.models.service_model import Service
from src.db.session import get_db
from pydantic import BaseModel

router = APIRouter()

class ServiceSchema(BaseModel):
    name: str
    description: str
    price: float
    category: str

@router.post("/services/")
def create_service(service: ServiceSchema, db: Session = Depends(get_db)):
    new_service = Service(**service.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return {"message": "Service created successfully", "service_id": new_service.id}

@router.get("/services/")
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return services

@router.get("/services/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.put("/services/{service_id}")
def update_service(service_id: int, service: ServiceSchema, db: Session = Depends(get_db)):
    existing_service = db.query(Service).filter(Service.id == service_id).first()
    if not existing_service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in service.dict().items():
        setattr(existing_service, key, value)
    db.commit()
    db.refresh(existing_service)
    return {"message": "Service updated successfully"}

@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}