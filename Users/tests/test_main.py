from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users/", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 201
    assert response.json() == {"username": "testuser"}

def test_get_user():
    response = client.get("/users/testuser")
    assert response.status_code == 200
    assert response.json() == {"username": "testuser"}

def test_update_user():
    response = client.put("/users/testuser", json={"password": "newpass"})
    assert response.status_code == 200
    assert response.json() == {"username": "testuser"}

def test_delete_user():
    response = client.delete("/users/testuser")
    assert response.status_code == 204

def test_user_not_found():
    response = client.get("/users/nonexistent")
    assert response.status_code == 404