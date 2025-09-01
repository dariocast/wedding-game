# Product Requirement Document (PRD)

## D&R Wedding Quest: Dario & Roberta

### 1. Introduzione e Obiettivi

#### 1.1. Visione del Prodotto

Creare un'applicazione web interattiva e divertente per intrattenere gli invitati durante il ricevimento di nozze di Dario e Roberta. La quest ha lo scopo di incoraggiare l'interazione tra i tavoli, creare momenti memorabili e aggiungere un elemento di competizione amichevole alla celebrazione.

#### 1.2. Obiettivi di Business

- Engagement: Aumentare il coinvolgimento e l'interazione tra gli invitati.
- Memorabilità: Creare un archivio digitale e divertente di foto e video della giornata, generato dagli stessi partecipanti.
- Intrattenimento: Offrire un'attività strutturata che possa intrattenere gli ospiti durante i momenti più tranquilli del ricevimento.

#### 1.3. Metriche di Successo

- Tasso di Partecipazione: % di invitati registrati sul totale.
- Numero di Sottomissioni: Numero totale di task completati (foto/video caricati).
- Engagement per Squadra: Numero medio di sottomissioni per ogni tavolo/squadra.

### 2. Ruoli Utente

#### 2.1. Invitato (Utente Standard)

- L'utente principale dell'applicazione.
- Permessi:
  - Può registrarsi con username, password e scegliere un tavolo (squadra).
  - Può effettuare il login.
  - Può visualizzare la classifica generale delle squadre.
  - Può visualizzare la lista dei task disponibili.
  - Può completare un task caricando una foto o un video.
  - Può visualizzare le sottomissioni completate da tutti gli altri partecipanti.
  - Non può modificare o eliminare le sottomissioni (proprie o altrui).

#### 2.2. Amministratore (Admin)

Un ruolo speciale (probabilmente uno degli sposi o un organizzatore) per la gestione della quest.

- Permessi:
  - Ha tutti i permessi di un Invitato.
  - Può accedere a una sezione di amministrazione protetta.
  - Può visualizzare tutte le sottomissioni in un'unica dashboard.
  - Può eliminare qualsiasi sottomissione (es. contenuti inappropriati).
  - Può modificare manualmente i punteggi di squadre e singoli partecipanti.
  - Può mettere in pausa e riavviare la quest, bloccando temporaneamente la possibilità di completare nuovi task.

### 3. Caratteristiche Principali (Features)

#### 3.1. Autenticazione

- Registrazione: Form con campi per username, password e un menu a tendina per selezionare il tavolo (squadra).
- Login: Form semplice con username e password.
- Gestione Sessione: L'utente rimane loggato fino al logout manuale.

#### 3.2. Homepage/Dashboard Utente

- Classifica: Visualizzazione in tempo reale della classifica dei tavoli, ordinata per punteggio totale decrescente. Deve mostrare Posizione, Nome Tavolo e Punteggio.
- Accesso ai Task: Un pulsante o link ben visibile per accedere alla lista dei task.

#### 3.3. Sistema di Task e Punteggi

- Lista Task: Una pagina che elenca tutti i task disponibili. Ogni task deve mostrare:
    - Descrizione: L'azione da compiere.
    - Punteggio: Il valore in punti (positivo o negativo) del task.
    - Sottomissione Task:
        1. L'utente seleziona un task da completare.
        2. Viene reindirizzato a una pagina di upload dove può caricare una foto o un video come prova.
        3. Al completamento, il punteggio del task viene assegnato sia all'utente che alla sua squadra.

#### 3.4. Galleria Pubblica

- Una pagina dove tutti i partecipanti possono vedere tutte le foto e i video caricati dagli altri, creando un feed dell'evento.

#### 3.5. Pannello di Amministrazione

- Dashboard Sottomissioni: Tabella con tutte le sottomissioni, ricercabile o filtrabile, con un pulsante "Elimina" per ogni riga.
- Gestione Punteggi (Opzionale v2): Interfaccia per aggiungere o sottrarre punti a una squadra.
- Controllo della Quest: Un interruttore "Pausa/Avvia Quest" per abilitare o disabilitare le sottomissioni a livello globale.

### 4. Requisiti Non Funzionali

- Usabilità: L'interfaccia deve essere estremamente semplice e intuitiva, pensata per un pubblico non tecnico e per un utilizzo rapido su smartphone.
- Performance: L'upload delle immagini e l'aggiornamento della classifica devono essere veloci.
- Responsività: Il design deve essere mobile-first, ottimizzato per la visualizzazione su smartphone.
- Sicurezza: Le password degli utenti devono essere criptate (hashing). L'accesso al pannello admin deve essere rigorosamente protetto.

### 5. Stack Tecnologico

- Framework: Next.js (con App Router e utilizzo della cartella src)
- Linguaggio: TypeScript
- Styling: Shadcn UI o Tailwind CSS
- Database: Supabase (Postgres)
- ORM: Prisma
- Autenticazione: NextAuth.js (o Supabase Auth)
- File Storage: Supabase Storage
- Deployment: Vercel (collegato a un repository GitHub)