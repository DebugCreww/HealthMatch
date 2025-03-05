from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_login():
    response = client.post("/auth/login", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_register():
    response = client.post("/auth/register", json={"username": "newuser", "password": "newpass"})
    assert response.status_code == 201
    assert response.json()["username"] == "newuser"