from fastapi import APIRouter, HTTPException, Depends, Request
from stripe.error import StripeError
import stripe
from pydantic import BaseModel
import os
from typing import Dict, Any

router = APIRouter()

# Configura Stripe con la chiave API
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str = "eur"
    booking_id: int
    client_id: int
    professional_id: int
    payment_method_id: str = None

@router.post("/stripe/create-payment-intent", response_model=Dict[str, Any])
async def create_payment_intent(payment_data: PaymentIntentRequest):
    """Crea un intent di pagamento con Stripe."""
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=payment_data.amount * 100,  # Stripe usa i centesimi
            currency=payment_data.currency,
            metadata={
                "booking_id": payment_data.booking_id,
                "client_id": payment_data.client_id,
                "professional_id": payment_data.professional_id
            },
            payment_method_types=["card"],
            payment_method=payment_data.payment_method_id if payment_data.payment_method_id else None,
        )
        
        return {
            "clientSecret": payment_intent.client_secret,
            "id": payment_intent.id,
            "status": payment_intent.status
        }
    except StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/stripe/webhook", status_code=200)
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
        
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            # Aggiorna lo stato del pagamento nel database
            # Invia notifica di pagamento completato
            print(f"Pagamento riuscito: {payment_intent['id']}")
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))