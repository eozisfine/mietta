# Page Builder - Guida d'uso

## Panoramica

Il sistema di Page Builder ti permette di creare, modificare e riordinare le sezioni della homepage in modo dinamico, senza dover modificare il codice.

## Setup Iniziale

### 1. Database Locale (Development)

Il database SQLite locale è già configurato. Basta avviare il progetto:

```bash
npm run dev
```

Il database verrà creato automaticamente in `local.db` alla prima richiesta.

### 2. Database Turso (Production)

Per usare Turso in production:

1. Crea un account su [Turso](https://turso.tech)
2. Crea un nuovo database:
   ```bash
   turso db create sassi-arredamenti
   ```
3. Ottieni l'URL e il token:
   ```bash
   turso db show sassi-arredamenti --url
   turso db tokens create sassi-arredamenti
   ```
4. Aggiorna `.env.local`:
   ```env
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

## Accesso all'Admin

Vai su: **http://localhost:3001/admin**

### Credenziali di default:
- **Username**: `admin`
- **Password**: `sassiadmin2024`

**IMPORTANTE**: Cambia queste credenziali nel file `.env.local` prima di andare in production!

```env
ADMIN_USERNAME=tuo_username
ADMIN_PASSWORD=tua_password_sicura
```

## Tipi di Sezioni Disponibili

### 1. Header con Immagine Full
- **Campi**: Titolo, Immagine
- **Uso**: Header principale con immagine a schermo intero

### 2. Titolo Sinistra - Testo Destra
- **Campi**: Titolo, Testo
- **Uso**: Layout a due colonne con titolo e descrizione

### 3. Immagine Box Destra
- **Campi**: Titolo, Immagine
- **Uso**: Immagine full height con box di testo a destra

### 4. Immagine Box Sinistra
- **Campi**: Titolo, Immagine
- **Uso**: Immagine full height con box di testo a sinistra

## Funzionalità

### Creare una Nuova Sezione

1. Clicca su "Aggiungi Sezione"
2. Seleziona il tipo di sezione
3. Compila i campi:
   - **Titolo**: Supporta HTML (es: `<b>testo</b>`, `<br/>` per andare a capo)
   - **Testo**: Per sezioni che lo richiedono
   - **Immagine**: Path relativo (es: `HomeHead.png`) o URL completo
   - **Animazione**: Scegli l'effetto di entrata
   - **Ritardo Animazione**: Tempo in secondi (0.0 - 2.0)
4. Clicca "Crea Sezione"

### Modificare una Sezione

1. Clicca sull'icona di modifica (matita)
2. Modifica i campi necessari
3. Clicca "Salva Modifiche"

### Riordinare le Sezioni

Usa le frecce ↑ ↓ per spostare le sezioni in alto o in basso

### Eliminare una Sezione

Clicca sull'icona del cestino e conferma l'eliminazione

## Animazioni Disponibili

- **Fade Up**: Appare dal basso
- **Fade Down**: Appare dall'alto
- **Fade Left**: Appare da sinistra
- **Fade Right**: Appare da destra
- **Fade In**: Appare con dissolvenza
- **Scale**: Appare con zoom

## Esempio di Utilizzo

Per ricreare la sezione header esistente:

1. Tipo: "Header con Immagine Full"
2. Titolo: `La lunga storia<br/>di chi sa creare<br/><b><i>bellezza</i></b>`
3. Immagine: `HomeHead.png`
4. Animazione: "Fade Up"
5. Ritardo: 0.1

## Note Importanti

- Le immagini vanno messe nella cartella `public/`
- Il titolo e il testo supportano HTML per formattazione
- Le sezioni vengono mostrate nell'ordine specificato
- Le sezioni esistenti (HomePageSectionThree, etc.) rimangono sempre alla fine
- Se non ci sono sezioni nel database, vengono mostrate solo le sezioni fisse

## Struttura del Database

```sql
sections
  - id: INTEGER (auto)
  - section_type: TEXT (tipo di sezione)
  - title: TEXT (titolo, opzionale)
  - text: TEXT (testo, opzionale)
  - image: TEXT (path immagine, opzionale)
  - order_index: INTEGER (ordine di visualizzazione)
  - animation: TEXT (tipo animazione)
  - animation_delay: REAL (ritardo in secondi)
  - created_at: DATETIME
  - updated_at: DATETIME
```

## API Endpoints

- `GET /api/sections` - Recupera tutte le sezioni
- `POST /api/sections` - Crea nuova sezione
- `PUT /api/sections/[id]` - Aggiorna sezione
- `DELETE /api/sections/[id]` - Elimina sezione
- `POST /api/sections/reorder` - Riordina sezioni
