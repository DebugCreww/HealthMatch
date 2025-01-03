from fastapi import FastAPI, HTTPException
from src.routes.gateway_routes import router as gateway_router

# Creazione dell'app FastAPI
app = FastAPI()

# Inclusione del router per le rotte del gateway
app.include_router(gateway_router)

# Rotta di base per verificare se il gateway è in esecuzione
@app.get("/")
def read_root():
    return {"message": "API Gateway is running"}
