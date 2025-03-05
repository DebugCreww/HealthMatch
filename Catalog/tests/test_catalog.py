import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app
from src.db.session import get_db
from src.models.service_model import Base, Service, Category, Specialty

# Configurazione del database di test
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Creazione delle tabelle nel database di test
Base.metadata.create_all(bind=engine)

# Override della dipendenza get_db
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Fixture per inizializzare dati di test
@pytest.fixture(scope="function")
def init_test_data():
    db = TestingSessionLocal()
    
    # Creazione di categorie di test
    cat_visita = Category(name="Visita Test", description="Categoria di test")
    db.add(cat_visita)
    db.commit()
    
    # Creazione di specialità di test
    spec_test = Specialty(name="Specialità Test", description="Specialità di test")
    db.add(spec_test)
    db.commit()
    
    # Creazione di servizi di test
    service = Service(
        name="Servizio Test",
        description="Descrizione del servizio di test",
        duration=30,
        base_price=100.0
    )
    service.categories.append(cat_visita)
    service.specialties.append(spec_test)
    db.add(service)
    db.commit()
    
    db.refresh(service)
    service_id = service.id
    
    db.close()
    
    return {"service_id": service_id}

# Test per il recupero dei servizi
def test_get_services(init_test_data):
    response = client.get("/api/v1/services/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Servizio Test"

# Test per il recupero di un servizio specifico
def test_get_service(init_test_data):
    service_id = init_test_data["service_id"]
    response = client.get(f"/api/v1/services/{service_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Servizio Test"
    assert data["base_price"] == 100.0
    assert data["duration"] == 30

# Test per la creazione di un servizio
def test_create_service():
    service_data = {
        "name": "Nuovo Servizio",
        "description": "Descrizione del nuovo servizio",
        "duration": 45,
        "base_price": 120.0,
        "categories": [],
        "specialties": []
    }
    response = client.post("/api/v1/services/", json=service_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Nuovo Servizio"
    assert data["base_price"] == 120.0

# Test per l'aggiornamento di un servizio
def test_update_service(init_test_data):
    service_id = init_test_data["service_id"]
    update_data = {
        "name": "Servizio Aggiornato",
        "description": "Descrizione aggiornata",
        "base_price": 150.0
    }
    response = client.put(f"/api/v1/services/{service_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Servizio Aggiornato"
    assert data["base_price"] == 150.0

# Test per l'eliminazione di un servizio
def test_delete_service(init_test_data):
    service_id = init_test_data["service_id"]
    response = client.delete(f"/api/v1/services/{service_id}")
    assert response.status_code == 200
    
    # Verifica che il servizio sia stato effettivamente eliminato
    response = client.get(f"/api/v1/services/{service_id}")
    assert response.status_code == 404

# Test per il recupero delle categorie
def test_get_categories():
    response = client.get("/api/v1/categories/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(cat["name"] == "Visita Test" for cat in data)

# Test per il recupero delle specialità
def test_get_specialties():
    response = client.get("/api/v1/specialties/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(spec["name"] == "Specialità Test" for spec in data)