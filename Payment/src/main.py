from fastapi import FastAPI
from src.routes.payment_routes import router as payment_router

app = FastAPI(title="HealthMatch Payment Service")

# Registra il router
app.include_router(payment_router)

@app.get("/status")
def status():
    return {"status": "ok"}
