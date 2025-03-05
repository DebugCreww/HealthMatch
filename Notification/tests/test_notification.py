import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app
from src.db.session import get_db
from src.models.notification_model import Base, Notification

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
    
    # Creazione di notifiche di test
    notification1 = Notification(
        recipient_id=1,
        title="Notifica di test 1",
        message="Questo è un messaggio di test",
        type="test"
    )
    notification2 = Notification(
        recipient_id=1,
        title="Notifica di test 2",
        message="Questo è un altro messaggio di test",
        type="test"
    )
    notification3 = Notification(
        recipient_id=2,
        title="Notifica per altro utente",
        message="Questo è un messaggio per un altro utente",
        type="test"
    )
    
    db.add(notification1)
    db.add(notification2)
    db.add(notification3)
    db.commit()
    
    db.refresh(notification1)
    db.refresh(notification2)
    db.refresh(notification3)
    
    notification_ids = {
        "user1_notification1": notification1.id,
        "user1_notification2": notification2.id,
        "user2_notification": notification3.id
    }
    
    db.close()
    
    return notification_ids

# Test per la creazione di una notifica
def test_create_notification():
    notification_data = {
        "recipient_id": 1,
        "title": "Notifica di test",
        "message": "Questo è un messaggio di test",
        "type": "test"
    }
    
    response = client.post("/api/v1/", json=notification_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data

# Test per il recupero delle notifiche di un utente
def test_get_user_notifications(init_test_data):
    response = client.get("/api/v1/user/1")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    assert data[0]["recipient_id"] == 1
    assert data[1]["recipient_id"] == 1

# Test per il recupero del conteggio delle notifiche non lette
def test_get_unread_count(init_test_data):
    response = client.get("/api/v1/user/1/count")
    assert response.status_code == 200
    
    data = response.json()
    assert "unread_count" in data
    assert data["unread_count"] == 2

# Test per marcare una notifica come letta
def test_mark_as_read(init_test_data):
    notification_id = init_test_data["user1_notification1"]
    response = client.patch(f"/api/v1/{notification_id}/read", json={"user_id": 1})
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "success"
    assert "read_at" in data
    
    # Verifica che il conteggio sia aggiornato
    count_response = client.get("/api/v1/user/1/count")
    count_data = count_response.json()
    assert count_data["unread_count"] == 1

# Test per eliminare una notifica
def test_delete_notification(init_test_data):
    notification_id = init_test_data["user1_notification2"]
    response = client.delete(f"/api/v1/{notification_id}?user_id=1")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "success"
    
    # Verifica che la notifica sia stata eliminata
    get_response = client.get(f"/api/v1/{notification_id}")
    assert get_response.status_code == 404