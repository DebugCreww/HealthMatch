from fastapi import FastAPI
from src.routes.notification_routes import router as notification_router

app = FastAPI(title="Notification Service")

app.include_router(notification_router)

@app.get("/")
def health_check():
    return {"message": "Notification Service is running"}
