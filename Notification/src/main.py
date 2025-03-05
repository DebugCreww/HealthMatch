from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.notification_routes import router as notification_router
from .models.notification_model import Base, engine

# Inizializzazione dell'app FastAPI
app = FastAPI(
    title="HealthMatch Notification Service",
    description="Servizio di notifiche per HealthMatch",
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

# Creazione delle tabelle nel database
Base.metadata.create_all(bind=engine)

# Registrazione del router principale
app.include_router(notification_router)

# Endpoint di status check
@app.get("/status")
def status():
    return {"status": "Notification service is running"}