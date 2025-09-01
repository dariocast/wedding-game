# 🎉 D&R Wedding Quest - Dario & Roberta

Un'applicazione web interattiva e divertente per intrattenere gli invitati durante il ricevimento di nozze di Dario e Roberta. La quest incoraggia l'interazione tra i tavoli, crea momenti memorabili e aggiunge un elemento di competizione amichevole alla celebrazione.

## ✨ Caratteristiche Principali

- **🎮 Sistema di Task**: Gli invitati completano task caricando foto e video
- **🏆 Classifica in Tempo Reale**: Punteggi dinamici per ogni tavolo/squadra
- **👥 Autenticazione Utenti**: Sistema di registrazione e login per i partecipanti
- **🖼️ Galleria Condivisa**: Visualizzazione di tutte le submission dei partecipanti
- **⚙️ Pannello Admin**: Gestione completa del gioco per gli organizzatori
- **📱 Design Responsive**: Ottimizzato per smartphone e dispositivi mobili

## 🚀 Stack Tecnologico

- **Framework**: Next.js 15 con App Router
- **Linguaggio**: TypeScript
- **Styling**: Skeleton CSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Autenticazione**: NextAuth.js
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## 📋 Prerequisiti

- Node.js 18+ 
- npm o yarn
- Account Supabase
- Account Vercel (per il deployment)

## 🛠️ Setup Locale

### 1. Clona il Repository

```bash
git clone <repository-url>
cd d-r-wedding-quest
```

### 2. Installa le Dipendenze

```bash
npm install
```

### 3. Configura le Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database URL (Supabase connection string)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 4. Configura Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
2. Copia l'URL del progetto e la chiave anonima dalle impostazioni API
3. Vai su "Storage" e crea un bucket chiamato `submissions`
4. Vai su "Database" e copia la connection string

### 5. Setup del Database

```bash
# Genera il client Prisma
npm run db:generate

# Sincronizza lo schema con il database
npm run db:push

# Popola il database con dati iniziali
npm run db:seed
```

### 6. Avvia il Server di Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

## 🗄️ Struttura del Database

### Tabelle Principali

- **`users`**: Utenti registrati con username, password e tavolo associato
- **`tables`**: Tavoli/squadre con punteggi
- **`tasks`**: Task disponibili con descrizione e punteggio
- **`submissions`**: Sottomissioni dei partecipanti (foto/video)

### Relazioni

- Un utente appartiene a un tavolo
- Un tavolo può avere più utenti
- Un task può avere più submission
- Una submission appartiene a un utente e un task

## 🔐 Sistema di Autenticazione

- **Registrazione**: Username unico, password, selezione tavolo
- **Login**: Credenziali username/password
- **Sessione**: JWT-based con NextAuth.js
- **Protezione**: Pagine protette per utenti autenticati

## 📱 Funzionalità Utente

### Invitati
- Registrazione e login
- Visualizzazione classifica tavoli
- Lista task disponibili
- Upload foto/video per completare task
- Galleria condivisa delle submission

### Amministratori
- Dashboard completa delle submission
- Eliminazione submission inappropriate
- Controllo stato del gioco (pausa/riavvio)
- Statistiche di partecipazione

## 🚀 Deployment su Vercel

### 1. Push su GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connetta a Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Importa il repository GitHub
3. Configura le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (URL di produzione)
   - `DATABASE_URL`

### 3. Deploy

Vercel rileverà automaticamente i push e farà il deploy dell'applicazione.

## 📊 Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo
npm run build        # Build per produzione
npm run start        # Avvia server di produzione

# Database
npm run db:generate  # Genera client Prisma
npm run db:push      # Sincronizza schema
npm run db:seed      # Popola database

# Linting
npm run lint         # Esegue ESLint
```

## 🔧 Configurazione Avanzata

### Personalizzazione Task

Modifica `prisma/seed.ts` per aggiungere/modificare i task disponibili:

```typescript
const tasks = await Promise.all([
  prisma.task.create({
    data: {
      description: 'Il tuo task personalizzato',
      score: 50,
    },
  }),
  // ... altri task
]);
```

### Personalizzazione Tavoli

Modifica `prisma/seed.ts` per aggiungere/modificare i tavoli:

```typescript
const tables = await Promise.all([
  prisma.table.create({ data: { name: 'Il tuo tavolo' } }),
  // ... altri tavoli
]);
```

## 🐛 Troubleshooting

### Problemi Comuni

1. **Errore di connessione database**: Verifica `DATABASE_URL` e credenziali Supabase
2. **Upload file non funziona**: Verifica configurazione bucket Supabase Storage
3. **Autenticazione non funziona**: Verifica `NEXTAUTH_SECRET` e `NEXTAUTH_URL`

### Log e Debug

- Controlla la console del browser per errori client-side
- Controlla i log del server per errori server-side
- Verifica le variabili d'ambiente sono caricate correttamente

## 📝 Note di Sviluppo

- L'applicazione è ottimizzata per dispositivi mobili
- Skeleton CSS fornisce un design pulito e responsive
- NextAuth.js gestisce l'autenticazione in modo sicuro
- Prisma fornisce type safety per le query database

## 🤝 Contributi

Questo progetto è stato sviluppato per un evento specifico. Per contributi o modifiche, contatta gli sviluppatori.

## 📄 Licenza

Progetto privato per uso personale.

---

**Buon divertimento al D&R Wedding Quest! 🎉💒**
