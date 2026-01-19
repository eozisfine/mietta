# Changelog

Tutte le modifiche rilevanti al CMS sono documentate in questo file.

## [1.1] - 2026-01-18

### Nuove Funzionalità

- **Effetto Parallax**: Background-attachment: fixed per sezioni con immagine di sfondo
  - Supportato su: HeaderImageFull, HeroImageCenter, ImageBoxRightFullh, ImageBoxLeftFullh, BannerWithLink, ImageTextOverlayLeft
  - Attivabile tramite switch nelle opzioni avanzate

- **Controlli Spacing**: Padding e margin personalizzabili per ogni sezione
  - Padding top/bottom
  - Margin top/bottom
  - Valori: xs, sm, md, lg, xl, 2xl, 3xl, 4xl

- **Visibilità Responsive**: Mostra/nascondi sezioni per breakpoint
  - `visible_from`: mostra da questo breakpoint in su
  - `hidden_from`: nascondi da questo breakpoint in su
  - Breakpoints: xs, sm, md, lg, xl

- **Redirect Manager integrato**: I redirect ora funzionano realmente
  - Integrazione nel middleware Next.js
  - Cache in memoria con TTL 60 secondi
  - Contatore hits per ogni redirect
  - Supporto redirect 301 (permanente) e 302 (temporaneo)

- **Guida Admin**: Documentazione completa accessibile da `/admin/guide`
  - Sezioni: Page Builder, Asset Manager, Menu, Contatti, Redirect, Backup, Impostazioni, Utenti

- **Pagina Changelog**: Timeline con cronologia versioni in `/admin/changelog`

### Modifiche Tecniche

- Nuove colonne nel database `page_sections`:
  - `image_fixed` (BOOLEAN)
  - `padding_top`, `padding_bottom` (TEXT)
  - `margin_top`, `margin_bottom` (TEXT)
  - `visible_from`, `hidden_from` (TEXT)

- Nuovi endpoint API:
  - `GET /api/redirects/active` - Lista redirect attivi per middleware
  - `POST /api/redirects/hit` - Incrementa contatore utilizzo

- Aggiornamento `middleware.ts`:
  - Funzione asincrona per fetch redirect
  - Cache in memoria per performance
  - Matcher ampliato per catturare tutte le route

- Aggiornamento `types/section.ts`:
  - Nuovi campi nello schema Zod
  - `BreakpointEnum` e `SpacingEnum` con transform

- Aggiornamento componenti sezioni:
  - Prop `imageFixed` per effetto parallax
  - Wrapper Box con props visibilità responsive

## [1.0] - 2026-01

### Release Iniziale

- **Page Builder**: Creazione pagine dinamiche con sezioni drag & drop
  - 26 tipi di sezioni disponibili
  - Supporto HTML base (bold, italic, line break)
  - Animazioni su scroll
  - Immagine mobile alternativa

- **Asset Manager**: Gestione file con Vercel Blob
  - Upload drag & drop
  - Organizzazione in cartelle
  - Conversione WebP
  - Sostituzione URL nel database

- **Gestione Menu**: Menu navigazione configurabile
  - Struttura gerarchica
  - Dropdown dinamici per categorie

- **Form Contatti**: Inbox messaggi
  - Stati: letto, risposto, archiviato
  - Note interne

- **Sistema Redirect**: Gestione reindirizzamenti URL
  - Tipi 301/302
  - Toggle attivo/disattivo

- **Backup/Restore**: Esportazione e importazione dati
  - Formato JSON
  - Selezione tabelle

- **Autenticazione**: Sistema login admin
  - Hash password SHA-256
  - Sessioni con scadenza 7 giorni
