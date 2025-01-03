from fastapi.testclient import TestClient
from src.main import app

# Creazione di un client di test
client = TestClient(app)

# Test per la creazione di una prenotazione
def test_create_booking():
    response = client.post("/api/v1/bookings/", json={
        "client_id": 1,
        "professional_id": 2,
        "service_id": 3,
        "date_time": "2025-01-10T14:00:00"
    })
    assert response.status_code == 200
    assert "booking_id" in response.json()
