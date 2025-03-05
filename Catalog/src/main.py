from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.catalog_routes import router as catalog_router
from .db.session import engine
from .models.service_model import Base

# Inizializzazione dell'app FastAPI
app = FastAPI(
    title="HealthMatch Catalog Service",
    description="Servizio di gestione catalogo per HealthMatch",
    version="1.0.0"
)

# Configurazione CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione, limita alle origini specifiche
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrazione del router principale
app.include_router(catalog_router)

# Creazione delle tabelle nel database
Base.metadata.create_all(bind=engine)

# Endpoint di status check
@app.get("/status")
def status():
    return {"status": "Catalog service is running"}

# Script di inizializzazione dei dati
@app.on_event("startup")
async def startup_db_client():
    """Inizializza dati di base nel database se necessario."""
    from sqlalchemy.orm import Session
    from .db.session import SessionLocal
    from .models.service_model import Category, Specialty, Professional, Service
    
    db = SessionLocal()
    
    # Verifica se ci sono già dati nel database
    if db.query(Category).count() == 0:
        # Categorie di base
        categories = [
            Category(name="Visita specialistica", description="Visite con specialisti della salute"),
            Category(name="Esame diagnostico", description="Esami per la diagnosi di patologie"),
            Category(name="Terapia", description="Trattamenti terapeutici")
        ]
        db.add_all(categories)
        db.commit()
        
    if db.query(Specialty).count() == 0:
        # Specialità di base
        specialties = [
            Specialty(name="Cardiologia", description="Specializzazione in malattie del cuore"),
            Specialty(name="Dermatologia", description="Specializzazione in malattie della pelle"),
            Specialty(name="Ginecologia", description="Specializzazione in salute femminile"),
            Specialty(name="Psicologia", description="Specializzazione in salute mentale"),
            Specialty(name="Ortopedia", description="Specializzazione in sistema muscolo-scheletrico")
        ]
        db.add_all(specialties)
        db.commit()
    
    db.close()