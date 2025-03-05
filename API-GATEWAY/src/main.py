from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.gateway_routes import router as api_router
import os

# Configurazione variabili d'ambiente con valori di default
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001/api/v1")
USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL", "http://users-service:8006/api/v1")
BOOKING_SERVICE_URL = os.getenv("BOOKING_SERVICE_URL", "http://booking-service:8002/api/v1")
CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://catalog-service:8003/api/v1")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8005/api/v1")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8004/api/v1")

app = FastAPI(
    title="HealthMatch API Gateway",
    description="API Gateway per HealthMatch",
    version="1.0.0"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione, limita alle origini specifiche
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra il router principale
app.include_router(api_router, prefix="/api/v1")

@app.get("/status")
async def status():
    return {"status": "API Gateway is running"}