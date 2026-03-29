# Easy Housing - Piattaforma di Compravendita e Aste Immobiliari

**Easy Housing** è un'applicazione web Full-Stack sviluppata per il progetto d'esame universitario. Consente agli utenti di esplorare, recensire, acquistare e vendere immobili, includendo un sistema avanzato di Aste a tempo.

## Funzionalità Principali

L'applicazione gestisce un sistema **RBAC (Role-Based Access Control)** con tre tipologie di utenti:
* **Acquirenti**: Possono esplorare gli annunci, salvare i preferiti, contattare i venditori, partecipare alle aste e lasciare recensioni.
* **Venditori**: Dispongono di una Dashboard dedicata per pubblicare annunci, impostare aste a tempo, modificare i prezzi e gestire il proprio portafoglio immobiliare.
* **Amministratori**: Hanno accesso a un *Admin Workspace* per gestire gli utenti (Ban/Promozione) e rimuovere annunci. Possono inoltre moderare le recensioni direttamente "in-context" sulle pagine degli immobili.

**Funzionalità di spicco:**
*  **Motore di Aste Real-Time**: Conto alla rovescia dinamico, gestione del rilancio minimo obbligatorio e chiusura automatica dell'asta.
*  **Validazione e Sicurezza**: Prevenzione di email duplicate (HTTP 409 Conflict), blocco di auto-offerte/messaggi per i venditori e validazione Regex rigorosa per email e password.
*  **Calcolatore di Valutazione**: Algoritmo step-by-step per stimare il valore di mercato di un immobile in base a parametri specifici (città, locali, metratura, ecc.).

##  Stack Tecnologico

* **Frontend**: Angular 17+ (Standalone Components), TypeScript, HTML5, CSS3, Bootstrap 5.
* **Backend**: Java 17, Spring Boot, RESTful API.
* **Database**: PostgreSQL, JDBC.

##  Design Patterns Applicati

Durante lo sviluppo sono stati applicati diversi pattern architetturali e di design per garantire un codice robusto e scalabile:
1. **MVC (Model-View-Controller)**: Strutturazione logica del Backend tramite Spring Boot.
2. **DAO (Data Access Object)**: Per astrarre e incapsulare tutti gli accessi al database (es. `ImmobileDaoImpl`, `UtenteDaoImpl`).
3. **Proxy Pattern (Virtual Proxy)**: Utilizzato nella classe `RecensioniProxy` per implementare il **Lazy Loading**. Le recensioni di un immobile vengono caricate dal database solo nel momento in cui la collection viene effettivamente interrogata, risolvendo il problema N+1 delle query e ottimizzando drasticamente l'utilizzo della memoria.

---

##  Guida all'Installazione e Avvio

Per eseguire l'applicazione in locale, assicurarsi di aver installato: **Node.js** (v18+), **Angular CLI**, **JDK 17+** e **PostgreSQL**.

### 1. Configurazione Database (PostgreSQL)
1. Aprire PgAdmin o il terminale PostgreSQL.
2. Creare un nuovo database vuoto chiamato esattamente: `immobiliare_db`
3. Ripristinare i dati e le tabelle eseguendo il file `database_dump.sql` che si trova nella cartella principale del progetto (`EasyHousing`).
4. *Nota Credenziali:* Il backend è configurato di default per accedere a PostgreSQL con username `postgres` e password `1234`. Se le proprie credenziali locali sono diverse, aggiornarle all'interno del file `application.properties` (o `DBConnection.java`) situato nel backend.

### 2. Avvio del Backend (Spring Boot / Java)
1. Aprire la cartella del backend (`EasyHousingBE`) con il proprio IDE (es. IntelliJ IDEA o Eclipse).
2. Aggiornare le dipendenze Maven.
3. Avviare la classe principale `EasyHousingApplication.java`.
4. Il server sarà in ascolto all'indirizzo `http://localhost:8080`.

### 3. Avvio del Frontend (Angular)
1. Aprire un terminale e navigare nella cartella del frontend (`EasyHousingFE`).
2. Installare i pacchetti Node necessari eseguendo il comando:
   ```bash
   npm install

### 4. Avviare il server di sviluppo Angular
1. ng serve

### 5. Aprire il browser all'indirizzo: http://localhost:4200 per utilizzare l'applicazione.

### Dati per il test
Ruolo: Admin,	email: admin@easyhousing.com, password:	admin;
Ruolo: Venditore, email: mario.rossi@venditore.com, password:	1234;
Ruolo: Acquirente, email:	giulia.neri@acquirente.com, password:	ciao;

Vincenzo Calabro, Matricola: 223527
