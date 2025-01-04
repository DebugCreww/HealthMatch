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

# Test per ottenere i dettagli di una prenotazione
def test_get_booking():
    response = client.get("/api/v1/bookings/1")
    assert response.status_code == 200
    assert "client_id" in response.json()

# Test per ottenere le prenotazioni di un utente
def test_get_user_bookings():
    response = client.get("/api/v1/bookings/user/1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test per aggiornare lo stato di una prenotazione
def test_update_booking():
    response = client.put("/api/v1/bookings/1", json={"status": "confirmed"})
    assert response.status_code == 200
    assert response.json()["message"] == "Booking updated successfully"

# Test per eliminare una prenotazione
def test_delete_booking():
    response = client.delete("/api/v1/bookings/1")
    assert response.status_code == 200
    assert response.json()["message"] == "Booking deleted successfully"