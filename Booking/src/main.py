from fastapi import FastAPI
from src.routes.booking_routes import router as booking_router

app = FastAPI()

app.include_router(booking_router)

@app.get("/")
def read_root():
    return {"message": "Booking Service is running"}
