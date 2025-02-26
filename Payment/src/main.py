import os
import stripe
from fastapi import FastAPI
from routes import payment_routes
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

app.include_router(payment_routes.router, prefix="/payments")

