import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app
from src.db.session import get_db
from src.models.user_model import Base, User, Specialty

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
    
    # Creazione di specialità di test
    specialty = Specialty(name="Test Specialty", description="Test Description")
    db.add(specialty)
    db.commit()
    
    # Creazione di utenti di test
    user = User(
        email="test@example.com",
        name="Test",
        surname="User",
        user_type="client"
    )
    db.add(user)
    
    professional = User(
        email="doctor@example.com",
        name="Doctor",
        surname="Test",
        user_type="professional",
        bio="Test bio",
        experience_years=5,
        rating=4.5
    )
    professional.specialties.append(specialty)
    db.add(professional)
    
    db.commit()
    
    db.refresh(user)
    db.refresh(professional)
    db.refresh(specialty)
    
    user_id = user.id
    professional_id = professional.id
    specialty_id = specialty.id
    
    db.close()
    
    return {"user_id": user_id, "professional_id": professional_id, "specialty_id": specialty_id}

# Test per la creazione di un utente
def test_create_user():
    response = client.post(
        "/api/v1/users/",
        json={
            "email": "newuser@example.com",
            "name": "New",
            "surname": "User",
            "user_type": "client"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New"
    assert data["surname"] == "User"
    assert data["user_type"] == "client"
    assert "id" in data

# Test per la creazione di un professionista
def test_create_professional():
    response = client.post(
        "/api/v1/professionals/",
        json={
            "email": "newdoctor@example.com",
            "name": "New",
            "surname": "Doctor",
            "user_type": "professional",
            "bio": "Doctor bio",
            "experience_years": 3,
            "specialties": []
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newdoctor@example.com"
    assert data["name"] == "New"
    assert data["surname"] == "Doctor"
    assert data["user_type"] == "professional"
    assert data["bio"] == "Doctor bio"
    assert "id" in data

# Test per il recupero di un utente
def test_read_user(init_test_data):
    user_id = init_test_data["user_id"]
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test"
    assert data["surname"] == "User"

# Test per il recupero di un professionista
def test_read_professional(init_test_data):
    professional_id = init_test_data["professional_id"]
    response = client.get(f"/api/v1/professionals/{professional_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == professional_id
    assert data["email"] == "doctor@example.com"
    assert data["name"] == "Doctor"
    assert data["surname"] == "Test"
    assert data["bio"] == "Test bio"
    assert data["rating"] == 4.5
    assert len(data["specialties"]) == 1

# Test per l'aggiornamento di un utente
def test_update_user(init_test_data):
    user_id = init_test_data["user_id"]
    response = client.put(
        f"/api/v1/users/{user_id}",
        json={
            "name": "Updated",
            "surname": "User"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["name"] == "Updated"
    assert data["surname"] == "User"

# Test per la ricerca di professionisti
def test_search_professionals(init_test_data):
    response = client.get("/api/v1/professionals/search")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["user_type"] == "professional"

# Test per il recupero delle specialità
def test_read_specialties(init_test_data):
    response = client.get("/api/v1/specialties/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Test Specialty"

# Test per la creazione di una specialità
def test_create_specialty():
    response = client.post(
        "/api/v1/specialties/",
        json={
            "name": "New Specialty",
            "description": "New specialty description"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Specialty"
    assert data["description"] == "New specialty description"
    assert "id" in data

# Test per l'eliminazione di un utente
def test_delete_user(init_test_data):
    user_id = init_test_data["user_id"]
    response = client.delete(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "User deleted successfully"
    
    # Verifichiamo che l'utente sia stato effettivamente eliminato
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 404