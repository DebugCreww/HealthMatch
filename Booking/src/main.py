from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import booking_routes
import uvicorn

app = FastAPI(
    title="HealthMatch Booking Service",
    description="Microservizio per la gestione degli appuntamenti",
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

# Includi i router delle API
app.include_router(booking_routes.router, prefix="/api/v1/bookings", tags=["Bookings"])

@app.get("/status")
async def status():
    """Endpoint per il health check."""
    return {"status": "online", "service": "booking"}

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8002, reload=True)
