from fastapi import APIRouter, HTTPException
import httpx
import datetime
from typing import Dict, Any

router = APIRouter()

# Definizione degli URL base per i microservizi
AUTH_SERVICE_URL = "http://auth-service:8001/api/v1"
USERS_SERVICE_URL = "http://users-service:8006/api/v1"
BOOKING_SERVICE_URL = "http://booking-service:8002/api/v1"
CATALOG_SERVICE_URL = "http://catalog-service:8003/api/v1"
PAYMENT_SERVICE_URL = "http://payment-service:8005/api/v1"
NOTIFICATION_SERVICE_URL = "http://notification-service:8004/api/v1"

# Include i router specifici per ciascun servizio
from .auth_routes import router as auth_router
from .booking_routes import router as booking_router
from .catalog_routes import router as catalog_router
from .payment_routes import router as payment_router
from .notification_routes import router as notification_router
from .user_routes import router as user_router

# Registrazione dei router
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(booking_router, prefix="/bookings", tags=["Bookings"])
router.include_router(catalog_router, prefix="/catalog", tags=["Catalog"])
router.include_router(payment_router, prefix="/payments", tags=["Payments"])
router.include_router(notification_router, prefix="/notifications", tags=["Notifications"])

# Endpoint di health check per tutti i servizi
@router.get("/health", tags=["System"])
async def health_check():
    health_status = {}
    
    async with httpx.AsyncClient() as client:
        for service_name, url in {
            "auth": f"{AUTH_SERVICE_URL}/status",
            "users": f"{USERS_SERVICE_URL}/status",
            "booking": f"{BOOKING_SERVICE_URL}/status", 
            "catalog": f"{CATALOG_SERVICE_URL}/status",
            "payment": f"{PAYMENT_SERVICE_URL}/status",
            "notification": f"{NOTIFICATION_SERVICE_URL}/status"
        }.items():
            try:
                response = await client.get(url, timeout=2.0)
                health_status[service_name] = "online" if response.status_code == 200 else "degraded"
            except Exception:  # Cattura tutte le eccezioni in modo esplicito
                health_status[service_name] = "offline"
    
    # Determina lo stato complessivo del sistema
    overall_status = "healthy"
    if "offline" in health_status.values():
        overall_status = "degraded"
    if all(status == "offline" for status in health_status.values()):
        overall_status = "offline"
    
    return {
        "status": overall_status,
        "services": health_status,
        "timestamp": datetime.datetime.now().isoformat()
    }