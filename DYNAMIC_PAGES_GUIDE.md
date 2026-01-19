# Sistema di Pagine Dinamiche - Guida d'uso

## Panoramica

Il sistema ti permette di creare pagine dinamiche (eventi, progetti, servizi) con sezioni personalizzabili, senza toccare il codice. Le pagine statiche esistenti (homepage, etc.) rimangono intatte.

## Concetti Base

### Pagine
Una **pagina** è un contenitore con:
- **Slug**: URL univoco (es: `evento-natale-2024`)
- **Categoria**: Tipo di pagina (eventi, progetti, servizi)
- **Titolo** e **Descrizione**: Per SEO

### Sezioni
Ogni pagina contiene **sezioni** (header, testo, immagini) che puoi:
- Aggiungere, modificare, eliminare
- Riordinare con frecce ↑ ↓
- Personalizzare con animazioni

## Accesso Admin

**URL**: http://localhost:3001/admin

**Credenziali** (cambiale in `.env.local`):
- Username: `admin`
- Password: `sassiadmin2024`

## Come Funziona

### 1. Creare una Nuova Pagina

1. Vai su http://localhost:3001/admin
2. Clicca "Nuova Pagina"
3. Compila:
   - **Categoria**: es. `eventi`
   - **Titolo**: es. "Evento Natale 2024"
   - **Slug**: auto-generato (es. `evento-natale-2024`)
   - **Descrizione**: opzionale, per SEO
   - **Stato**: Pubblicato / Bozza
4. Salva

La pagina sarà accessibile su: `/eventi/evento-natale-2024`

### 2. Aggiungere Sezioni alla Pagina

1. Dalla lista pagine, clicca l'icona 👁️ (occhio verde)
2. Clicca "Nuova Sezione"
3. Scegli il tipo:
   - **Header con Immagine Full**: Hero section con immagine
   - **Titolo Sinistra - Testo Destra**: Layout a 2 colonne
   - **Immagine Box Destra**: Immagine + box testo a destra
   - **Immagine Box Sinistra**: Immagine + box testo a sinistra
4. Compila i campi
5. Scegli animazione e ritardo
6. Salva

### 3. Gestire le Sezioni

- **Riordinare**: Usa frecce ↑ ↓
- **Modificare**: Clicca icona matita blu
- **Eliminare**: Clicca icona cestino rosso

## Tipi di Sezione

### Header con Immagine Full
```
Campi: Titolo, Immagine
Uso: Hero section principale
```

### Titolo Sinistra - Testo Destra
```
Campi: Titolo, Testo
Uso: Presentazione con layout a 2 colonne
```

### Immagine Box Destra
```
Campi: Titolo, Immagine
Uso: Immagine full height con box di testo a destra
```

### Immagine Box Sinistra
```
Campi: Titolo, Immagine
Uso: Immagine full height con box di testo a sinistra
```

## Suggerimenti HTML

Nei campi **Titolo** e **Testo** puoi usare HTML:

```html
<b>Grassetto</b>
<i>Corsivo</i>
<br/> <!-- A capo -->
<b><i>Grassetto e corsivo</i></b>
```

Esempio:
```html
La nostra<br/><b>storia</b> inizia<br/><i>nel 1919</i>
```

## Immagini

Le immagini vanno nella cartella `public/`:

```
public/
  ├── evento-natale.jpg
  ├── progetto-cucina.png
  └── ...
```

Nel campo immagine scrivi solo il nome: `evento-natale.jpg`

Oppure usa un URL completo: `https://esempio.com/immagine.jpg`

## Categorie e URL

Ogni categoria determina l'URL base:

- **eventi** → `/eventi/[slug]`
- **progetti** → `/progetti/[slug]`
- **servizi** → `/servizi/[slug]`

### Esempio Pratico

```
Categoria: eventi
Slug: mostra-design-2024
→ URL: /eventi/mostra-design-2024
```

## Struttura Database

```sql
pages
  - id
  - slug (univoco)
  - title
  - description
  - category
  - published
  - created_at
  - updated_at

page_sections
  - id
  - page_id (FK)
  - section_type
  - title
  - text
  - image
  - order_index
  - animation
  - animation_delay
  - created_at
  - updated_at
```

## API Endpoints

### Pagine
- `GET /api/pages` - Lista tutte le pagine
- `GET /api/pages?category=eventi` - Filtra per categoria
- `POST /api/pages` - Crea pagina
- `GET /api/pages/[id]` - Dettagli pagina
- `PUT /api/pages/[id]` - Modifica pagina
- `DELETE /api/pages/[id]` - Elimina pagina (e sezioni)

### Sezioni
- `GET /api/pages/[id]/sections` - Lista sezioni di una pagina
- `POST /api/pages/[id]/sections` - Crea sezione
- `PUT /api/sections/[id]` - Modifica sezione
- `DELETE /api/sections/[id]` - Elimina sezione
- `POST /api/sections/reorder` - Riordina sezioni

## Workflow Completo

### Creare "Evento Natale 2024"

1. **Crea la pagina**:
   - Categoria: `eventi`
   - Titolo: "Evento Natale 2024"
   - Slug: `evento-natale-2024` (auto)
   - Descrizione: "Speciale evento natalizio"

2. **Aggiungi Header**:
   - Tipo: Header con Immagine Full
   - Titolo: `Natale<br/><b>2024</b>`
   - Immagine: `natale-header.jpg`
   - Animazione: Fade Up

3. **Aggiungi Descrizione**:
   - Tipo: Titolo Sinistra - Testo Destra
   - Titolo: `Un evento<br/>speciale`
   - Testo: `Vieni a scoprire le nostre proposte...`
   - Animazione: Fade Left

4. **Aggiungi Immagine**:
   - Tipo: Immagine Box Destra
   - Titolo: `Le nostre proposte`
   - Immagine: `natale-prodotti.jpg`
   - Animazione: Fade Right

5. **Pubblica**: Salva tutto e visita `/eventi/evento-natale-2024`

## Note Importanti

- Le **pagine statiche esistenti** (homepage, etc.) NON sono modificate
- Lo **slug deve essere univoco** (errore se già esiste)
- **Eliminare una pagina** elimina anche tutte le sue sezioni
- Le pagine **non pubblicate** (Bozza) non sono visibili pubblicamente
- Il database locale è in `local.db` (per development)

## Sicurezza

L'area admin è protetta da Basic Authentication.

**IMPORTANTE**: Cambia le credenziali in production!

```env
# .env.local
ADMIN_USERNAME=tuo_username
ADMIN_PASSWORD=password_sicura_123
```

## Deployment con Turso (Production)

Per usare Turso invece di SQLite locale:

1. Crea account su [turso.tech](https://turso.tech)
2. Crea database:
   ```bash
   turso db create sassi-arredamenti
   ```
3. Ottieni credenziali:
   ```bash
   turso db show sassi-arredamenti --url
   turso db tokens create sassi-arredamenti
   ```
4. Aggiorna `.env.local`:
   ```env
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```

## Troubleshooting

### Slug già esistente
- Cambia lo slug o elimina la pagina esistente

### Immagine non si vede
- Verifica che il file sia in `public/`
- Controlla il nome file (case-sensitive)

### Sezioni non in ordine
- Usa le frecce ↑ ↓ per riordinare
- L'ordine si salva automaticamente

### Pagina 404
- Verifica che la pagina sia pubblicata
- Controlla l'URL: `/{category}/{slug}`
