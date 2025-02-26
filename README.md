# HealthMatch

HealthMatch è una piattaforma progettata per mettere in contatto clienti con professionisti del benessere, facilitando la prenotazione di servizi personalizzati.

**Requisiti**

Assicurati di avere installato sul tuo sistema:

- Docker per l'esecuzione dei container.
- Docker Compose per orchestrare i vari servizi.

**Struttura del Progetto**

Il progetto è composto da diversi microservizi, ciascuno con responsabilità specifiche:

- Auth Service: Gestione dell'autenticazione e autorizzazione.
- User Management Service: Gestione dei profili utente.
- Service Catalog Service: Gestione del catalogo dei servizi offerti.
- Booking Service: Gestione delle prenotazioni tra clienti e professionisti.
- Payment Service: Gestione dei pagamenti per i servizi prenotati.
- Notification Service: Gestione delle notifiche verso gli utenti.
- API Gateway: Punto di ingresso unificato per tutti i servizi.
- Frontend: Interfaccia utente sviluppata in React.

**Configurazione e Installazione**

1. Clona il Repository
    
    git clone [https://github.com/DebugCreww/HealthMatch.git](https://github.com/DebugCreww/HealthMatch.git)
    
    cd HealthMatch
    
2. Configura le Variabili d'Ambiente

Ogni microservizio potrebbe richiedere specifiche variabili d'ambiente. È consigliabile creare un file `.env` nella root del progetto per definire queste variabili.

Esempio di contenuto del file `.env`:

DATABASE_URL=sqlite:///./healthmatch.db

AUTH_SECRET_KEY=your_secret_key

AUTH_ALGORITHM=HS256

1. Aggiorna il Docker Compose per SQLite

Nel file `docker-compose.yml`, assicurati che i servizi siano configurati per utilizzare SQLite.

1. Avvia i Servizi con Docker Compose
    
    docker-compose up --build
    
2. Accesso all'Applicazione
- Frontend: Accedi tramite [http://localhost:3000](http://localhost:3000/) (o la porta configurata) per l'interfaccia utente.
- API Gateway: Le API sono accessibili tramite [http://localhost:8000](http://localhost:8000/) (o la porta configurata).

**Definizione degli Oggetti di Interfaccia**

1. Dashboard Cliente
- Funzionalità: Visualizzazione delle prenotazioni attive, storico delle prenotazioni e accesso rapido ai servizi preferiti.
- Elementi UI: Pannello di controllo con riepilogo, link rapidi ai servizi e notifiche recenti.
1. Lista Servizi
- Funzionalità: Esplorazione dei servizi offerti dai professionisti, con possibilità di filtrare per categoria, prezzo e valutazione.
- Elementi UI: Elenco dei servizi con immagini, descrizioni brevi, prezzi e pulsanti per la prenotazione.
1. Calendario Prenotazioni
- Funzionalità: Visualizzazione delle disponibilità dei professionisti e gestione degli appuntamenti.
- Elementi UI: Calendario interattivo con slot disponibili e opzioni per la prenotazione.
1. Profilo Professionista
- Funzionalità: Visualizzazione delle informazioni dettagliate sul professionista, comprese le qualifiche, le recensioni e i servizi offerti.
- Elementi UI: Sezione con foto del professionista, biografia, elenco dei servizi e valutazioni dei clienti.
1. Sezione Recensioni
- Funzionalità: Consultazione delle recensioni lasciate dai clienti e possibilità di aggiungere una nuova recensione.
- Elementi UI: Elenco delle recensioni con valutazioni a stelle, commenti e form per l'inserimento di nuove recensioni.

**Struttura delle Pagine**

1. Home Page
- Sezioni Chiave: Introduzione alla piattaforma, servizi in evidenza e testimonianze dei clienti.
- Componenti Inclusi: Banner promozionale, carosello dei servizi e sezione delle recensioni.
1. Pagina del Servizio
- Sezioni Chiave: Dettagli del servizio, informazioni sul professionista e calendario delle disponibilità.
- Componenti Inclusi: Descrizione del servizio, profilo del professionista e modulo di prenotazione.
1. Pagina del Profilo Utente
- Sezioni Chiave: Informazioni personali, storico delle prenotazioni e impostazioni dell'account.
- Componenti Inclusi: Form per l'aggiornamento dei dati personali, elenco delle prenotazioni passate e opzioni per la gestione dell'account.
1. Pagina delle Recensioni
- Sezioni Chiave: Elenco delle recensioni ricevute e form per l'invio di nuove recensioni.
- Componenti Inclusi: Lista delle recensioni con opzioni di filtro e modulo per l'aggiunta di feedback.

**Modello Architetturale**

HealthMatch adotta un'architettura a microservizi, in cui ogni servizio è responsabile di una specifica funzionalità. I principali componenti includono:

- Auth Service: Gestisce l'autenticazione e l'autorizzazione degli utenti.
- User Management Service: Si occupa della gestione dei profili utente.
- Service Catalog Service: Mantiene il catalogo dei servizi offerti.
- Booking Service: Gestisce le prenotazioni tra clienti e professionisti.
- Payment Service: Si occupa della gestione dei pagamenti.
- Notification Service: Invia notifiche agli utenti.
- API Gateway: Funziona come punto di ingresso unificato, instradando le richieste ai rispettivi servizi.
- Frontend: Fornisce l'interfaccia utente.

**Aspetti Implementativi**

L'implementazione delle API REST segue un'architettura basata su FastAPI per garantire alte prestazioni e scalabilità.

- Tutte le API sono documentate tramite Swagger e OpenAPI.
- I dati vengono memorizzati in SQLite per garantire leggerezza e semplicità di gestione.
- I pagamenti vengono elaborati attraverso Stripe o PayPal.
- Il frontend comunica con il backend tramite chiamate REST ai microservizi.

**Test**

Per eseguire i test unitari e di integrazione:
docker-compose exec <nome_servizio> pytest

Sostituisci `<nome_servizio>` con il nome del servizio su cui desideri eseguire i test.

**Contributi**

Contributi, segnalazioni di bug e suggerimenti sono benvenuti! Per favore, apri un'issue o una pull request su [https://github.com/DebugCreww/HealthMatch](https://github.com/DebugCreww/HealthMatch).

**Licenza**

Questo progetto è distribuito sotto la licenza MIT. Vedi il file LICENSE per maggiori dettagli.
