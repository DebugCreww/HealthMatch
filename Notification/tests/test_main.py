from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_send_notification():
    response = client.post("/notifications/send", json={"message": "Test notification"})
    assert response.status_code == 200
    assert response.json() == {"status": "success", "message": "Notification sent"}

def test_receive_notification():
    response = client.get("/notifications/receive")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Assuming notifications are returned as a list