from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_product_list():
    response = client.get("/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_product_details():
    response = client.get("/products/1")
    assert response.status_code == 200
    assert "name" in response.json()
    assert "description" in response.json()

def test_create_product():
    response = client.post("/products", json={"name": "Test Product", "description": "Test Description"})
    assert response.status_code == 201
    assert response.json()["name"] == "Test Product"

def test_update_product():
    response = client.put("/products/1", json={"name": "Updated Product"})
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Product"

def test_delete_product():
    response = client.delete("/products/1")
    assert response.status_code == 204
    response = client.get("/products/1")
    assert response.status_code == 404