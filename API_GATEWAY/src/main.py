from fastapi import FastAPI, HTTPException
from src.routes.gateway_routes import router as gateway_router

app = FastAPI()

app.include_router(gateway_router)

@app.get("/")
def read_root():
    return {"message": "API Gateway is running"}
