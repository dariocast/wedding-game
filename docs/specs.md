# **Piano di Sviluppo: Wedding Quest 🚀 (Versione Supabase & Skeleton)**

Questa è la roadmap dettagliata e aggiornata per completare l'applicazione, basata sul nuovo stack tecnologico.

### **Fase 0: Setup e Fondamenta (Da rifare)**

Questa fase adatta il progetto a Supabase e Skeleton CSS.

#### **Passo 1: Rimuovere le Vecchie Dipendenze**

* Disinstalla Tailwind CSS e le dipendenze di NextAuth se presenti:  
  npm uninstall tailwindcss postcss autoprefixer next-auth bcrypt

* Rimuovi i file di configurazione di Tailwind (tailwind.config.ts, postcss.config.mjs).  
* Elimina la cartella src/app/api/auth e il file middleware.ts originale.

#### **Passo 2: Configurare Supabase**

1. **Installare i Client**:  
   npm install @supabase/supabase-js

2. **Ottenere le Credenziali**: Dal tuo progetto supabase-rose-ball su Supabase, vai su "Project Settings" \> "API". Prendi nota di:  
   * Project URL  
   * API Key (quella anon public)  
3. **Impostare le Variabili d'Ambiente**: Crea un file .env.local nella root del progetto e aggiungi le chiavi:  
   NEXT\_PUBLIC\_SUPABASE\_URL=TUA\_URL\_DEL\_PROGETTO  
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=TUA\_CHIAVE\_ANON\_PUBBLICA

4. **Collegare Prisma a Supabase**:  
   * Vai su "Project Settings" \> "Database" in Supabase e copia la Connection string (URI).  
   * Apri il file .env (quello usato da Prisma) e aggiorna la variabile DATABASE\_URL con la stringa di connessione di Supabase, assicurandoti di inserire la tua password.  
   * Apri prisma/schema.prisma e cambia il provider in postgresql.  
   * Esegui una nuova migrazione per sincronizzare lo schema con il database Supabase:  
     npx prisma migrate dev \--name "initial\_supabase\_migration"

   * Esegui nuovamente il seed per popolare il database Supabase: npx prisma db seed.

#### **Passo 3: Configurare Skeleton CSS**

1. **Aggiungere i Fogli di Stile**: Apri il file src/app/layout.tsx e aggiungi i link ai CSS di Skeleton nel tag \<head\>. Rimuovi l'import di globals.css se non ti serve più.  
   // src/app/layout.tsx  
   \<head\>  
     ...  
     \<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" /\>  
     \<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" /\>  
     ...  
   \</head\>

2. **Adattare il Layout**: Avvolgi il contenuto principale in un \<div class="container"\> per centrare il layout secondo lo stile di Skeleton.

#### **Passo 4: Implementare l'Autenticazione (con il vecchio sistema per ora)**

* Dato che abbiamo già il codice per NextAuth, per ora lo manteniamo. Funzionerà correttamente con il database Supabase (Postgres) esattamente come prima. La transizione a Supabase Auth può essere un'ottimizzazione futura.  
* **Ripristina il middleware** e le API di autenticazione che avevamo creato, assicurandoti che funzionino correttamente dopo la migrazione del database.

### **Fase 1: Implementare il Gameplay Principale (con Skeleton)**

L'obiettivo rimane lo stesso, ma le classi CSS cambieranno.

#### **Passo 1: Creare la Pagina con la Lista dei Task**

* **API Route**: Invariata (src/app/api/tasks/route.ts).  
* **Pagina UI** (src/app/tasks/page.tsx):  
  * Usa le classi di Skeleton: container, row, column, button-primary.  
  * Esempio di un task:  
    \<div class="row"\>  
      \<div class="nine columns"\>  
        \<h5\>Fai un selfie di gruppo\</h5\>  
        \<p\>Punteggio: \<strong style="color: green;"\>50\</strong\>\</p\>  
      \</div\>  
      \<div class="three columns"\>  
        \<a class="button button-primary u-full-width" href="/tasks/TASK\_ID/submit"\>Completa\</a\>  
      \</div\>  
    \</div\>

#### **Passo 2: Implementare la Sottomissione con Supabase Storage**

1. **Creare l'API per l'Upload**:  
   * Crea una API route in src/app/api/submit/route.ts.  
   * Questa API userà il client Supabase per caricare i file:  
     * Riceve il taskId e i dati del file.  
     * Usa supabase.storage.from('submissions').upload(filePath, file). (Dovrai creare un bucket chiamato submissions nel pannello di Supabase Storage).  
     * Una volta ottenuto l'URL pubblico del file, crea il record Submission nel database usando Prisma come prima.  
2. **Costruire la Pagina di Sottomissione**:  
   * Usa un form standard di Skeleton con \<input type="file" /\> e un \<button class="button-primary" type="submit"\>Invia\</button\>.

#### **Passo 3: Rendere Dinamica la Classifica sulla Homepage**

* **API per la Classifica**: Invariata (src/app/api/leaderboard/route.ts).  
* **Aggiornare la Homepage**: Usa una tabella di Skeleton (\<table class="u-full-width"\>) per mostrare la classifica.

### **Fase 2 e 3 (Invariate nella logica, da adattare nello stile)**

Le fasi successive rimangono concettualmente le stesse, ma ogni componente UI dovrà essere costruito usando le classi e la griglia di Skeleton CSS invece di Tailwind.

* **Galleria Pubblica**: Usa la griglia di Skeleton (row, one-third column, etc.) per creare il layout delle immagini.  
* **Pannello Admin**: Costruisci la dashboard usando tabelle, form e bottoni di Skeleton.  
* **Deployment**: Il processo è ora più semplice. Poiché usi già Supabase, non devi migrare il database in produzione. Il flusso sarà:  
  1. **Fai un git push** sul tuo repository GitHub.  
  2. Vercel rileverà il push e avvierà una nuova build e deployment.  
  3. Le variabili d'ambiente di Supabase che hai collegato a Vercel verranno usate automaticamente.