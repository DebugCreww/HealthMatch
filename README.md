# HealtMatch
# Requisiti

### **Linguaggi e Strumenti per ogni Microservizio**

### **1. Auth Service**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `PyJWT`: Per la generazione e gestione di token JWT.
    - `passlib`: Per l'hashing delle password.
    - `SQLAlchemy`: Per la gestione del database.
    - `bcrypt`: Per la sicurezza delle password.

---

### **2. User Management Service**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `SQLAlchemy`: Per la gestione dei dati degli utenti.
    - `Pydantic`: Per la validazione degli input e output.
    - `databases`: Per gestire connessioni asincrone al database.

---

### **3. Service Catalog Service**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `SQLAlchemy`: Per la gestione del catalogo servizi.
    - `Pydantic`: Per la validazione.
    - `databases`: Per la connessione asincrona al database.
    - `pytest`: Per il testing.

---

### **4. Booking Service**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `SQLAlchemy`: Per gestire le relazioni di prenotazione.
    - `Pydantic`: Per i modelli di validazione.
    - `httpx`: Per comunicazioni asincrone (se richiesto da altri microservizi).

---

### **5. Payment Service**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `stripe`: Per l'integrazione con Stripe (o `paypalrestsdk` per PayPal).
    - `Pydantic`: Per la validazione.
    - `SQLAlchemy`: Per tracciare i pagamenti nel database.

---

### **6. Notification Service (opzionale)**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `smtplib` o `SendGrid`: Per l'invio di email.
    - `pika` o `celery`: Per la gestione delle code di messaggi (es. RabbitMQ).
    - `Pydantic`: Per validazione dei payload.

---

### **7. API Gateway**

- **Linguaggio**: Python
- **Framework**: FastAPI
- **Librerie**:
    - `httpx`: Per instradare richieste ai microservizi.
    - `Pydantic`: Per validazione delle richieste.
    - `pytest`: Per il testing delle integrazioni.
    - `uvicorn`: Per l'esecuzione del server.

---

### **Gestione dell'intero sistema**

### **1. Strumenti di gestione del progetto**

- **Version Control**: Git (con GitHub/GitLab/Bitbucket).
- **Containerizzazione**: Docker per ogni microservizio.
- **Orchestrazione**: Docker Compose per lo sviluppo locale; Kubernetes per la produzione.

---

### **2. Database**

- **Scelta dei database**:
    - PostgreSQL: Per dati strutturati come utenti, prenotazioni, catalogo.
    - Redis: Per cache e gestione di sessioni (opzionale).
    - MongoDB: Per dati non strutturati o logs (opzionale).
- **Schema di separazione**:
    - Ogni microservizio gestisce il proprio database per una separazione delle responsabilità.

---

### **3. Comunicazione tra microservizi**

- **Protocollo**:
    - gRPC: Per comunicazioni rapide e fortemente tipizzate.
    - REST: Per endpoint HTTP più semplici da gestire inizialmente.
- **Code di messaggi**:
    - RabbitMQ o Kafka: Per gestire task asincroni (es. notifiche, elaborazione pagamenti).

---

### **4. Sicurezza**

- **Autenticazione e Autorizzazione**:
    - Utilizzo di JWT con scadenza per sessioni sicure.
    - Middleware per convalidare token JWT in ciascun microservizio.
- **Crittografia**:
    - Crittografia dei dati sensibili (password, dettagli di pagamento) con `bcrypt` o `PyCrypto`.
- **HTTPS**:
    - Configura NGINX/Traefik per servire l'app tramite HTTPS.

---

### **5. Deployment**

- **Ambiente di Produzione**:
    - Utilizzo di Kubernetes per orchestrare i container.
    - Servizi cloud consigliati: AWS (EKS), Google Cloud (GKE), Azure (AKS).
- **Monitoraggio**:
    - Prometheus e Grafana per monitorare lo stato e le prestazioni dei microservizi.
    - ELK Stack (Elasticsearch, Logstash, Kibana) per il logging centralizzato.

---

### **6. Test e QA**

- **Tipi di test**:
    - **Unit Test**: Test dei singoli componenti in ogni microservizio.
    - **Integration Test**: Verifica delle interazioni tra i microservizi.
    - **End-to-End Test**: Simulazione dei flussi completi degli utenti.
- **Strumenti consigliati**:
    - `pytest`: Per i test unitari e di integrazione.
    - `Postman` o `Newman`: Per testare manualmente le API.

---

### **7. CI/CD (opzionale per ora, ma consigliato a lungo termine)**

- **Pipeline consigliata**:
    - Lanciare test unitari -> Build dei container Docker -> Deploy in staging -> Test automatici -> Deploy in produzione.
- **Strumenti**:
    - GitHub Actions, GitLab CI/CD, Jenkins.

---

### **Approccio Generale**

1. **Step iniziale**: Completa i microservizi principali (Auth, User, Booking).
2. **Passo successivo**: Integra i microservizi con l'API Gateway.
3. **Testing e iterazione**: Rilascia una versione minima funzionante (MVP) e migliora iterativamente.



### **1. Auth Service**

**Scopo**: Gestire l'autenticazione e l'autorizzazione degli utenti nel sistema.

### **Funzioni principali**:

1. **Registrazione utenti** (`POST /auth/register`):
    - Permette a un cliente o professionista di creare un account.
    - Input: Nome, email, password, ruolo (cliente o professionista).
    - Output: Conferma della registrazione o errore (es. email già registrata).
2. **Login utenti** (`POST /auth/login`):
    - Permette agli utenti di accedere.
    - Input: Email e password.
    - Output: Token JWT utilizzabile per accedere alle altre risorse.
3. **Refresh token** (`POST /auth/refresh`):
    - Genera un nuovo token JWT prima della scadenza di quello attuale.
    - Input: Token JWT scaduto.
    - Output: Nuovo token JWT.
4. **Verifica token** (`POST /auth/verify`):
    - Controlla la validità di un token JWT.
    - Output: Conferma della validità o errore (token scaduto/non valido).

---

### **2. User Management Service**

**Scopo**: Gestire i profili degli utenti (clienti e professionisti).

### **Funzioni principali**:

1. **Visualizza profilo utente** (`GET /users/{user_id}`):
    - Recupera le informazioni di un cliente o professionista specifico.
    - Output: Nome, email, ruolo, informazioni aggiuntive.
2. **Aggiorna profilo utente** (`PUT /users/{user_id}`):
    - Permette agli utenti di aggiornare le proprie informazioni (es. nome, email, password).
    - Input: Informazioni aggiornate.
3. **Elimina profilo utente** (`DELETE /users/{user_id}`):
    - Rimuove un profilo dal sistema.
    - Output: Conferma dell'eliminazione.
4. **Lista professionisti** (`GET /users/professionals`):
    - Ritorna un elenco di professionisti filtrabili (es. per categoria o disponibilità).
    - Output: Nome, categoria, recensioni, esperienza.

---

### **3. Service Catalog Service**

**Scopo**: Gestire i servizi offerti dai professionisti.

### **Funzioni principali**:

1. **Aggiungi un servizio** (`POST /catalog/services`):
    - Permette a un professionista di aggiungere un nuovo servizio.
    - Input: Nome del servizio, descrizione, prezzo, categoria.
    - Output: Conferma dell'aggiunta.
2. **Elimina un servizio** (`DELETE /catalog/services/{service_id}`):
    - Rimuove un servizio dal catalogo.
    - Output: Conferma della cancellazione.
3. **Modifica un servizio** (`PUT /catalog/services/{service_id}`):
    - Permette a un professionista di aggiornare i dettagli di un servizio.
    - Input: Dettagli aggiornati (es. prezzo, descrizione).
4. **Visualizza servizi** (`GET /catalog/services`):
    - Recupera tutti i servizi disponibili, con possibilità di filtri (es. categoria, prezzo).
    - Output: Elenco dei servizi.
5. **Dettaglio di un servizio** (`GET /catalog/services/{service_id}`):
    - Ritorna i dettagli di un servizio specifico (nome, descrizione, prezzo, professionista).

---

### **4. Booking Service**

**Scopo**: Gestire le prenotazioni di servizi tra clienti e professionisti.

### **Funzioni principali**:

1. **Crea prenotazione** (`POST /bookings`):
    - Permette a un cliente di prenotare un servizio.
    - Input: `service_id`, `professional_id`, data e ora della prenotazione.
    - Output: ID della prenotazione.
2. **Visualizza prenotazione** (`GET /bookings/{booking_id}`):
    - Recupera i dettagli di una prenotazione specifica.
    - Output: Data, ora, stato (es. confermato, completato).
3. **Elenco prenotazioni utente** (`GET /bookings/user/{user_id}`):
    - Lista delle prenotazioni di un cliente o di un professionista.
    - Output: Elenco con data, stato, dettagli servizio.
4. **Aggiorna stato prenotazione** (`PUT /bookings/{booking_id}`):
    - Aggiorna lo stato di una prenotazione (es. confermato, completato, annullato).
    - Input: Nuovo stato.
5. **Elimina prenotazione** (`DELETE /bookings/{booking_id}`):
    - Rimuove una prenotazione.
    - Output: Conferma della cancellazione.

---

### **5. Payment Service**

**Scopo**: Gestire i pagamenti relativi alle prenotazioni.

### **Funzioni principali**:

1. **Elabora pagamento** (`POST /payments`):
    - Processa un pagamento per una prenotazione.
    - Input: `booking_id`, metodo di pagamento (es. carta di credito), importo.
    - Output: ID del pagamento, stato (es. completato, fallito).
2. **Visualizza dettagli pagamento** (`GET /payments/{payment_id}`):
    - Recupera i dettagli di un pagamento specifico.
3. **Storico pagamenti utente** (`GET /payments/user/{user_id}`):
    - Lista dei pagamenti effettuati da un cliente.
4. **Annulla pagamento** (`POST /payments/cancel/{payment_id}`):
    - Annulla un pagamento in sospeso o rimborsa l'importo.
5. **Verifica stato pagamento** (`GET /payments/status/{payment_id}`):
    - Controlla lo stato di un pagamento (completato, in sospeso).

---

### **6. Notification Service**

**Scopo**: Inviare notifiche ai clienti e ai professionisti.

### **Funzioni principali**:

1. **Invia notifica Slack** (`POST /notifications/slack`):
    - Invia una notifica a un canale Slack (es. conferma prenotazione).
    - Input: Canale Slack, messaggio.
2. **Invia notifica email** (`POST /notifications/email`):
    - Invia una notifica via email.
    - Input: Destinatario, oggetto, corpo del messaggio.
3. **Visualizza notifiche inviate** (`GET /notifications/logs`):
    - Recupera lo storico delle notifiche inviate.

---

### **7. LLM Service**

**Scopo**: Fornire funzionalità basate su un modello di linguaggio AI.

### **Funzioni principali**:

1. **Completamento testo** (`POST /llm/completion`):
    - Esegue il completamento di un testo fornito.
    - Input: Frase o contesto iniziale.
2. **Classificazione testo** (`POST /llm/classify`):
    - Classifica un testo in base a categorie definite.
3. **Risposta a domanda** (`POST /llm/qa`):
    - Risponde a domande in base a un contesto fornito.
4. **Analisi sentimentale** (`POST /llm/sentiment`):
    - Analizza il sentimento di un testo (positivo, negativo, neutro).
5. **Storico richieste** (`GET /llm/logs`):
    - Visualizza lo storico delle richieste elaborate dal modello.

---

### **8. API Gateway**

**Scopo**: Instradare tutte le richieste ai rispettivi microservizi.

### **Funzioni principali**:

1. **Autenticazione delle richieste**:
    - Verifica e decodifica i token JWT.
2. **Routing delle richieste**:
    - Instrada le richieste agli endpoint corretti.
3. **Rate Limiting**:
    - Limita il numero di richieste per utente o IP.
4. **Log delle richieste**:
    - Registra ogni richiesta per monitoraggio e debugging.