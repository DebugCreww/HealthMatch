from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.user_routes import router as user_router
from .models.user_model import Base
from .db.session import engine
import os

# Inizializzazione dell'app FastAPI
app = FastAPI(
    title="HealthMatch Users Service",
    description="Servizio di gestione utenti per HealthMatch",
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
app.include_router(user_router)

# Creazione delle tabelle nel database
Base.metadata.create_all(bind=engine)

# Endpoint di status check
@app.get("/status")
def status():
    return {"status": "Users service is running"}

# Inizializzazione dei dati di base
@app.on_event("startup")
async def startup_db_client():
    """Inizializza dati di base nel database se necessario."""
    from sqlalchemy.orm import Session
    from .db.session import SessionLocal
    from .models.user_model import Specialty
    from .services import user_service
    
    db = SessionLocal()
    
    # Verifica se ci sono già dati nel database
    if db.query(Specialty).count() == 0:
        # Specialità di base
        specialties = [
            {"name": "Cardiologia", "description": "Specializzazione in malattie del cuore"},
            {"name": "Dermatologia", "description": "Specializzazione in malattie della pelle"},
            {"name": "Ginecologia", "description": "Specializzazione in salute femminile"},
            {"name": "Psicologia", "description": "Specializzazione in salute mentale"},
            {"name": "Ortopedia", "description": "Specializzazione in sistema muscolo-scheletrico"},
            {"name": "Neurologia", "description": "Specializzazione in sistema nervoso"},
            {"name": "Oculistica", "description": "Specializzazione in vista e occhi"},
            {"name": "Otorinolaringoiatria", "description": "Specializzazione in orecchie, naso e gola"}
        ]
        
        for specialty in specialties:
            try:
                user_service.create_specialty(db, name=specialty["name"], description=specialty["description"])
            except ValueError:
                # Ignora errori di duplicate key, probabilmente la specialità esiste già
                pass
    
    db.close()