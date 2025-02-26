# filepath: Payment/src/routes/payment_routes.py
import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import stripe

router = APIRouter()

class CreatePaymentIntentRequest(BaseModel):
    amount: int
    currency: str

@router.post("/create-payment-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
        )
        return {"client_secret": intent.client_secret}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        # Fulfill the purchase...
    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        # Notify the customer that their order was not fulfilled...

    return {"status": "success"}