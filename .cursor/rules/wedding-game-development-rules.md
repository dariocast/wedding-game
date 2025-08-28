# Wedding Game Development Rules

## 🎯 **PRINCIPI FONDAMENTALI**

### 1. **Documentazione Continua**
- **SEMPRE** documentare ogni modifica in `docs/development_log.md`
- Aggiornare il log PRIMA di implementare qualsiasi cambiamento
- Mantenere traccia di errori, soluzioni e decisioni tecniche
- Usare formato strutturato con timestamp e descrizioni dettagliate

### 2. **Build Verification**
- **SEMPRE** eseguire `npm run build` prima di commit e push
- Non fare mai push se la build fallisce
- Risolvere tutti gli errori TypeScript e ESLint prima del deploy
- Verificare che non ci siano warning critici

### 3. **Stile di Comunicazione**
- Risposte **concise** e **dirette**
- Trattare l'utente come un **esperto**
- Evitare ripetizioni e linguaggio di riempimento
- Fornire soluzioni immediate e actionable

## 🎨 **DESIGN SYSTEM & UI**

### 4. **Wedding Theme Consistency**
- **Palette Colori Obbligatoria:**
  ```css
  --wedding-white: #ffffff
  --wedding-picton: #00a7e1
  --wedding-black: #00171f
  --wedding-prussian: #003459
  --wedding-cerulean: #007ea7
  ```
- Usare **sempre** questa palette per coerenza visiva
- Applicare gradienti e glassmorphism effects per eleganza
- Mantenere tema matrimoniale in **tutte** le pagine

### 5. **CSS Architecture**
- Usare **custom CSS** in `globals.css` invece di framework esterni
- Definire utility classes riutilizzabili (`.btn-wedding-primary`, `.card-wedding`, etc.)
- Implementare animazioni smooth (`.animate-fade-in`, `.animate-float`)
- Responsive design con media queries per mobile-first

### 6. **Component Styling Standards**
- **Inline styles** per proprietà specifiche e dinamiche
- **CSS classes** per styling riutilizzabile e temi
- **Glassmorphism** per card e modal (`backdrop-filter: blur()`)
- **Hover effects** su tutti gli elementi interattivi
- **Emoji decorativi** per migliorare UX (📊, 🏆, ✨, etc.)

## 🏗️ **ARCHITETTURA TECNICA**

### 7. **Next.js App Router Pattern**
- Usare **App Router** (non Pages Router)
- Client components con `'use client'` quando necessario
- API routes in `src/app/api/` con pattern RESTful
- Middleware e layout per funzionalità condivise

### 8. **Database & API Design**
- **Prisma ORM** per type-safety e migrations
- **Supabase** per PostgreSQL e file storage
- API routes con proper error handling e status codes
- Validazione input sia client che server-side

### 9. **Authentication & Security**
- **NextAuth.js** per gestione sessioni
- **Role-based access** con `isAdmin` flag
- **Protected routes** con redirect automatici
- **Environment variables** per configurazioni sensibili

## 🔧 **DEVELOPMENT WORKFLOW**

### 10. **Error Handling Strategy**
- **Graceful degradation** per tutti i componenti
- **Loading states** eleganti con animazioni
- **Error boundaries** con messaggi user-friendly
- **Fallback content** per dati mancanti (placeholder SVG, etc.)

### 11. **Performance Optimization**
- **Client-side compression** per file uploads (browser-image-compression)
- **Lazy loading** per componenti pesanti
- **Optimistic updates** per migliore UX
- **Caching strategies** per API calls frequenti

### 12. **TypeScript Best Practices**
- **Strict typing** per tutti i componenti e API
- **Interface definitions** per data structures
- **Type guards** per runtime validation
- **Generic types** per componenti riutilizzabili

## 🎯 **FEATURE IMPLEMENTATION**

### 13. **Modal & Dialog Standards**
- **Wedding-themed modals** con `.modal-wedding` class
- **Keyboard navigation** (ESC per chiudere, arrow keys per navigare)
- **Focus management** con autofocus su elementi principali
- **Backdrop click** per chiudere modal
- **Smooth animations** per apertura/chiusura

### 14. **Form Design Patterns**
- **Validation real-time** con feedback visivo
- **Wedding-styled inputs** (`.input-wedding`)
- **Clear error messages** in italiano
- **Submit/Cancel button pairs** con styling consistente
- **Confirmation dialogs** per azioni distruttive

### 15. **Data Management**
- **Optimistic updates** per migliore perceived performance
- **Real-time filtering** senza server calls
- **Pagination** quando necessario per grandi dataset
- **State management** con React hooks (useState, useEffect, useCallback)

## 📱 **RESPONSIVE DESIGN**

### 16. **Mobile-First Approach**
- **Breakpoints standard:** 768px per tablet, 1024px per desktop
- **Touch-friendly** button sizes (min 44px)
- **Readable font sizes** su tutti i dispositivi
- **Horizontal scrolling** evitato sempre

### 17. **Grid & Layout Systems**
- **CSS Grid** per layout complessi (`.grid-wedding`, `.grid-wedding-2`, etc.)
- **Flexbox** per allineamenti e distribuzioni
- **Container queries** quando supportate
- **Aspect ratios** mantenuti per media content

## 🚀 **DEPLOYMENT & MAINTENANCE**

### 18. **Vercel Deployment Standards**
- **Environment variables** configurate nel dashboard Vercel
- **Build optimization** con Prisma generate in postinstall
- **Error monitoring** con proper logging
- **Performance monitoring** per Core Web Vitals

### 19. **Git Workflow**
- **Commit messages** descrittivi con emoji e categorie
- **Feature branches** per sviluppi complessi
- **Atomic commits** per modifiche logicamente correlate
- **No force push** su main branch

### 20. **Code Quality**
- **ESLint rules** rispettate sempre
- **Prettier formatting** per consistency
- **Type checking** rigoroso
- **Performance audits** regolari

## 🎨 **SPECIFIC WEDDING GAME PATTERNS**

### 21. **Admin Panel Design**
- **Tab navigation** per sezioni diverse
- **CRUD operations** con modal dialogs
- **Confirmation prompts** per eliminazioni
- **Real-time updates** dopo modifiche
- **Role-based visibility** per funzioni admin

### 22. **Gallery & Media Handling**
- **Grid layout** responsive per media
- **Modal expansion** per visualizzazione dettagliata
- **Keyboard navigation** tra immagini
- **Filtering system** completo e intuitivo
- **Compression** automatica per ottimizzazione storage

### 23. **Task & Submission Flow**
- **Progressive disclosure** per task details
- **File upload** con drag & drop
- **Progress indicators** durante upload
- **Success/error feedback** immediato
- **Redirect** dopo submission completata

### 24. **Leaderboard & Scoring**
- **Real-time updates** dei punteggi
- **Visual hierarchy** per posizioni
- **Animated counters** per engagement
- **Color coding** per punteggi positivi/negativi
- **Responsive tables** per tutti i dispositivi

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### 25. **Common Issues Resolution**
- **Build failures:** Sempre controllare TypeScript errors per primi
- **Styling conflicts:** Verificare CSS specificity e inheritance
- **API errors:** Controllare environment variables e database connections
- **Authentication issues:** Verificare NextAuth configuration e session handling

### 26. **Performance Debugging**
- **Bundle analysis** per identificare bottlenecks
- **Network tab** per API call optimization
- **Lighthouse audits** per performance metrics
- **Console warnings** da risolvere sempre

## 📚 **DOCUMENTATION STANDARDS**

### 27. **Code Documentation**
- **JSDoc comments** per funzioni complesse
- **README updates** per nuove features
- **API documentation** per endpoint changes
- **Component props** documentate con TypeScript interfaces

### 28. **User-Facing Documentation**
- **Error messages** in italiano, chiari e actionable
- **Help text** per form complessi
- **Loading states** informativi
- **Success confirmations** specifiche per azione

## 🎯 **QUALITY ASSURANCE**

### 29. **Testing Strategy**
- **Manual testing** su tutti i browser principali
- **Mobile testing** su dispositivi reali
- **Edge cases** per input validation
- **Performance testing** sotto carico

### 30. **Accessibility Standards**
- **Keyboard navigation** completa
- **Screen reader** compatibility
- **Color contrast** sufficiente per readability
- **Focus indicators** visibili e chiari

---

## 📋 **CHECKLIST PRE-DEPLOY**

Prima di ogni deploy, verificare:

- [ ] `npm run build` eseguito con successo
- [ ] Tutti gli errori TypeScript risolti
- [ ] Nessun warning ESLint critico
- [ ] Test manuali su funzionalità modificate
- [ ] Environment variables configurate su Vercel
- [ ] Database migrations applicate se necessarie
- [ ] `docs/development_log.md` aggiornato
- [ ] Commit message descrittivo e completo
- [ ] Performance check su funzionalità critiche

---

## 🎨 **WEDDING THEME COMPONENTS REFERENCE**

### CSS Classes Standard:
```css
/* Layout */
.container-wedding
.card-wedding
.card-wedding-dark
.grid-wedding, .grid-wedding-2, .grid-wedding-3, .grid-wedding-4

/* Typography */
.heading-wedding
.subheading-wedding
.font-elegant

/* Buttons */
.btn-wedding-primary
.btn-wedding-secondary  
.btn-wedding-outline

/* Forms */
.input-wedding

/* Decorative */
.wedding-divider
.wedding-badge

/* Animations */
.animate-fade-in
.animate-float

/* Modals */
.modal-wedding
.modal-content-wedding
```

### Color Variables:
```css
:root {
  --wedding-white: #ffffff;
  --wedding-picton: #00a7e1;
  --wedding-black: #00171f;
  --wedding-prussian: #003459;
  --wedding-cerulean: #007ea7;
  --wedding-gradient: linear-gradient(135deg, #ffffff 0%, #00a7e1 25%, #007ea7 50%, #003459 75%, #00171f 100%);
  --wedding-gradient-soft: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%);
}
```

---

**Queste regole garantiscono consistenza, qualità e maintainability per tutto il progetto Wedding Game. Seguire sempre questi standard per assicurare un'esperienza utente eccellente e un codice di alta qualità.**
