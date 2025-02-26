import stripe

def create_payment_intent(amount: int, currency: str):
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
        )
        return intent.client_secret
    except stripe.error.StripeError as e:
        raise Exception(f"Stripe error: {str(e)}")