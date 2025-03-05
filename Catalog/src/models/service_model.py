from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Tabella di associazione per la relazione many-to-many tra servizi e categorie
service_category_association = Table(
    'service_category_association',
    Base.metadata,
    Column('service_id', Integer, ForeignKey('services.id')),
    Column('category_id', Integer, ForeignKey('categories.id'))
)

# Tabella di associazione per la relazione many-to-many tra servizi e specialità
service_specialty_association = Table(
    'service_specialty_association',
    Base.metadata,
    Column('service_id', Integer, ForeignKey('services.id')),
    Column('specialty_id', Integer, ForeignKey('specialties.id'))
)

# Tabella di associazione per la relazione many-to-many tra professionisti e servizi
professional_service_association = Table(
    'professional_service_association',
    Base.metadata,
    Column('professional_id', Integer, ForeignKey('professionals.id')),
    Column('service_id', Integer, ForeignKey('services.id'))
)

class Service(Base):
    __tablename__ = 'services'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False)  # durata in minuti
    base_price = Column(Float, nullable=False)
    
    # Relazioni
    categories = relationship("Category", secondary=service_category_association, back_populates="services")
    specialties = relationship("Specialty", secondary=service_specialty_association, back_populates="services")
    professionals = relationship("Professional", secondary=professional_service_association, back_populates="services")

class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    
    # Relazioni
    services = relationship("Service", secondary=service_category_association, back_populates="categories")

class Specialty(Base):
    __tablename__ = 'specialties'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    
    # Relazioni
    services = relationship("Service", secondary=service_specialty_association, back_populates="specialties")

class Professional(Base):
    __tablename__ = 'professionals'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    
    # Relazioni
    services = relationship("Service", secondary=professional_service_association, back_populates="professionals")

# Schemi per la validazione e serializzazione con Pydantic
from pydantic import BaseModel
from typing import List, Optional

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int
    base_price: float

class ServiceCreate(ServiceBase):
    categories: List[int] = []
    specialties: List[int] = []

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    base_price: Optional[float] = None
    categories: Optional[List[int]] = None
    specialties: Optional[List[int]] = None

class ServiceResponse(ServiceBase):
    id: int
    categories: List[str] = []
    specialties: List[str] = []
    
    class Config:
        from_attributes = True  # Aggiornato da orm_mode = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True  # Aggiornato da orm_mode = True

class SpecialtyBase(BaseModel):
    name: str
    description: Optional[str] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyResponse(SpecialtyBase):
    id: int
    
    class Config:
        from_attributes = True  # Aggiornato da orm_mode = True