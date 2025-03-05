from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_payment_processing():
    response = client.post("/payment/process", json={"amount": 100, "currency": "USD"})
    assert response.status_code == 200
    assert response.json() == {"status": "success", "message": "Payment processed successfully."}

def test_payment_error_handling():
    response = client.post("/payment/process", json={"amount": -100, "currency": "USD"})
    assert response.status_code == 400
    assert response.json() == {"status": "error", "message": "Invalid payment amount."}