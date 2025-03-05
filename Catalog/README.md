# HealthMatch Catalog Service

Microservizio per la gestione del catalogo di servizi offerti dai professionisti sanitari sulla piattaforma HealthMatch.

## Caratteristiche

- Gestione servizi (creazione, aggiornamento, eliminazione)
- Gestione categorie di servizi
- Gestione specialità mediche
- Associazione di servizi a professionisti
- Filtri per specialità, categoria e professionista

## Installazione

### Prerequisiti

- Python 3.9+
- Ambiente virtuale (opzionale ma consigliato)

### Configurazione

1. Clonare il repository

```bash
git clone <repository-url>
cd catalog-service
```

2. Creare e attivare un ambiente virtuale (opzionale)

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oppure
venv\Scripts\activate  # Windows
```

3. Installare le dipendenze

```bash
pip install -r requirements.txt
```

4. Configurare le variabili d'ambiente

Crea un file `.env` nella root del progetto con i seguenti valori:

```
DATABASE_URL=sqlite:///./catalog.db  # Usa PostgreSQL in produzione
```

## Inizializzazione Database

Per inizializzare il database con alcuni dati di esempio, eseguire:

```bash
python init_db.py
```

## Avvio del Servizio

```bash
uvicorn src.main:app --reload
```

Il servizio sarà disponibile all'indirizzo `http://localhost:8003` con la documentazione delle API accessibile a `http://localhost:8003/docs`.

## Utilizzo

### Endpoint Principali

- **GET /api/v1/services/** - Recupera tutti i servizi (supporta filtri per specialità e categoria)
- **GET /api/v1/services/{service_id}** - Recupera un servizio specifico
- **POST /api/v1/services/** - Crea un nuovo servizio
- **PUT /api/v1/services/{service_id}** - Aggiorna un servizio esistente
- **DELETE /api/v1/services/{service_id}** - Elimina un servizio

- **GET /api/v1/categories/** - Recupera tutte le categorie
- **POST /api/v1/categories/** - Crea una nuova categoria

- **GET /api/v1/specialties/** - Recupera tutte le specialità
- **POST /api/v1/specialties/** - Crea una nuova specialità

- **GET /api/v1/professionals/{professional_id}/services** - Recupera i servizi offerti da un professionista
- **POST /api/v1/professionals/{professional_id}/services/{service_id}** - Aggiunge un servizio a un professionista
- **DELETE /api/v1/professionals/{professional_id}/services/{service_id}** - Rimuove un servizio da un professionista

### Esempi di Richieste

#### Creare un nuovo servizio

```bash
curl -X 'POST' \
  'http://localhost:8003/api/v1/services/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Visita specialistica",
  "description": "Prima visita con specialista",
  "duration": 30,
  "base_price": 100,
  "categories": [1],
  "specialties": [2]
}'
```

#### Recuperare i servizi filtrati per specialità

```bash
curl -X 'GET' \
  'http://localhost:8003/api/v1/services/?specialty=Cardiologia' \
  -H 'accept: application/json'
```

## Test

Per eseguire i test:

```bash
pytest
```

## Integrazione nel Sistema

Questo microservizio è progettato per lavorare come parte del sistema HealthMatch, comunicando con altri servizi attraverso l'API Gateway.

## Container Docker

Per eseguire il servizio in un container Docker:

```bash
docker build -t healthmatch-catalog .
docker run -p 8003:8003 healthmatch-catalog
```

In alternativa, utilizzare docker-compose per avviare l'intero sistema:

```bash
docker-compose up -d
```

## Licenza

Vedi il file LICENSE per i dettagli.