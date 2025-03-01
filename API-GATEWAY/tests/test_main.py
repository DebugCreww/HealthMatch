from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_api_gateway_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the HealthMatch API Gateway"}

def test_api_gateway_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_api_gateway_invalid_route():
    response = client.get("/invalid-route")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}