import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

// Carica .env.prod per le credenziali Turso remote
dotenv.config({ path: '.env.prod' });

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Mancano TURSO_DATABASE_URL o TURSO_AUTH_TOKEN in .env.prod');
  process.exit(1);
}

console.log('🔗 Connessione a Turso:', TURSO_URL);

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

// Contenuti estratti da wp_postmeta Elementor
const BIOGRAFIA_TEXT = `<p>Nata a Milano, si è laureata in Architettura e diplomata in Scenografia all'Accademia di Brera.</p>
<p>E' stata per molti anni aiuto-regista di Pierluigi Pieralli.</p>
<p>Svolge attività di regista e scenografa nell'ambito del teatro musicale e uno degli aspetti particolari della sua ricerca è l'uso del linguaggio video in uno stretto rapporto con musica e drammaturgia.</p>
<p>Su questo tema ha tenuto seminari all'Accademia d'Arti e Mestieri dello Spettacolo del Teatro alla Scala di Milano, all'Università di Stavanger in Norvegia e dal 2007 insegna a Parigi al CFPTS (Centre de Formation professionnelle aux techniques du Spectacle) nel programma del corso di « Régisseur vidéo de spectacle ».</p>
<p>Dal 2004 al 2007 è stata consulente artistica del Circulo Portuense de Opera (CPO) di Porto, in Portogallo, per la realizzazione di produzioni liriche al Teatro Coliseu do Porto.</p>
<p>Tra le principali produzioni realizzate:</p>
<p>il 4° atto dell'Otello verdiano per l'inaugurazione 2014 del nuovo Teatro d'Opera di Firenze, Maggio Musicale Fiorentino, i Carmina Burana in forma scenica al Teatro Regio di Torino, L'Arlesiana e il 3° atto di Parsifal per il Teatro Regio di Parma, La Bhoème per il Teatro San Carlo di Napoli, Madama Butterfly per il Teatro Sao Carlos di Lisbona e per il Teatro alla Scala di Milano, Il Flauto Magico, Le nozze di Figaro e Carmen per il Teatro Coliseu do Porto, La Traviata, Otello, Il Trovatore per il Festival di Busseto/Fondazione Toscanini, La Princesse Jaune di C.Saint-Saens e La scuola di guida di Nino Rota per l'Accademia Chigiana di Siena.</p>`;

const OTELLO_TEXT = `<p>Il 4° atto dell'Otello di Giuseppe Verdi è stato realizzato per l'inaugurazione del nuovo Teatro dell'Opera di Firenze nel 2014, nell'ambito del Maggio Musicale Fiorentino.</p>
<p>La regia, la scenografia e i video sono stati curati da Mietta Corli, con la direzione musicale di Zubin Mehta.</p>
<p>La produzione ha rappresentato un momento significativo nella storia del teatro lirico italiano, combinando tradizione e innovazione tecnologica attraverso l'uso di proiezioni video integrate con la scenografia tradizionale.</p>`;

const CARMINA_TEXT = `<p>I Carmina Burana di Carl Orff in forma scenica sono stati realizzati per il Teatro Regio di Torino.</p>
<p>La produzione ha visto la regia e la scenografia di Mietta Corli, con un uso innovativo del video per amplificare la dimensione visiva e drammaturgica dell'opera.</p>
<p>L'allestimento ha esplorato i temi della ruota della fortuna e del destino attraverso un linguaggio visivo contemporaneo, mantenendo il potente impatto emotivo della partitura di Orff.</p>`;

const INSEGNAMENTO_TEXT = `<p>Dal 2007 Mietta Corli insegna a Parigi al CFPTS (Centre de Formation professionnelle aux techniques du Spectacle) nel programma del corso di « Régisseur vidéo de spectacle ».</p>
<p>Ha tenuto seminari all'Accademia d'Arti e Mestieri dello Spettacolo del Teatro alla Scala di Milano e all'Università di Stavanger in Norvegia.</p>
<p>L'attività didattica si concentra sull'uso del linguaggio video nel teatro musicale, esplorando il rapporto tra immagine, musica e drammaturgia.</p>
<p>Gli ateliers artistici con gli allievi del CFPTS a Parigi rappresentano un momento di sperimentazione e ricerca, dove teoria e pratica si fondono nella realizzazione di progetti video originali.</p>`;

const PRODUZIONI_VIDEO_TEXT = `<p>Le produzioni video rappresentano uno degli aspetti più innovativi del lavoro di Mietta Corli.</p>
<p>L'uso del linguaggio video nel teatro musicale si basa su uno stretto rapporto con musica e drammaturgia, creando un dialogo tra immagine e suono che amplifica l'esperienza dello spettatore.</p>
<p>Oltre alle produzioni liriche, Mietta Corli realizza installazioni video e video clips, esplorando le possibilità espressive del medium video in contesti artistici diversi.</p>`;

const PROGETTI_TEXT = `<p>I progetti in corso d'opera rappresentano il lavoro attuale e futuro di Mietta Corli.</p>
<p>Nuove produzioni liriche, installazioni video e collaborazioni artistiche sono in fase di sviluppo, continuando la ricerca sull'uso del video nel teatro musicale.</p>`;

const RECENSIONI_TEXT = `<p>Le recensioni delle produzioni di Mietta Corli testimoniano l'apprezzamento della critica per il suo lavoro innovativo nel teatro musicale.</p>
<p>La stampa specializzata ha sottolineato l'originalità dell'approccio visivo e l'efficacia dell'integrazione tra video e scenografia tradizionale.</p>`;

const CONTATTI_TEXT = `<p>Per informazioni e contatti:</p>
<p>Email: info@miettacorli.it</p>
<p>Mietta Corli vive tra Milano, Venezia e Parigi.</p>`;

async function initDb() {
  // Tabella pagine
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      cover_image TEXT,
      published BOOLEAN DEFAULT 1,
      published_at DATETIME,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      seo_og_image TEXT,
      seo_no_index BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella sezioni
  await db.execute(`
    CREATE TABLE IF NOT EXISTS page_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      section_type TEXT NOT NULL,
      title TEXT,
      text TEXT,
      image TEXT,
      image_mobile TEXT,
      href TEXT,
      button_text TEXT,
      order_index INTEGER NOT NULL,
      animation TEXT DEFAULT 'fadeUp',
      animation_delay REAL DEFAULT 0.1,
      image_fixed BOOLEAN DEFAULT 0,
      padding_top TEXT,
      padding_bottom TEXT,
      margin_top TEXT,
      margin_bottom TEXT,
      visible_from TEXT,
      hidden_from TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

  // Tabella storico
  await db.execute(`
    CREATE TABLE IF NOT EXISTS page_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      description TEXT,
      old_data TEXT,
      new_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

  // Tabella utenti
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      enabled BOOLEAN DEFAULT 1,
      reset_token TEXT,
      reset_token_expires DATETIME,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella sessioni
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabella menu
  await db.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      href TEXT NOT NULL,
      parent_id INTEGER,
      order_index INTEGER NOT NULL DEFAULT 0,
      visible BOOLEAN DEFAULT 1,
      open_in_new_tab BOOLEAN DEFAULT 0,
      is_dynamic_dropdown BOOLEAN DEFAULT 0,
      dropdown_source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
    )
  `);

  // Tabella impostazioni
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT NOT NULL UNIQUE,
      setting_value TEXT,
      setting_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella contatti
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      archived BOOLEAN DEFAULT 0,
      replied BOOLEAN DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella redirect
  await db.execute(`
    CREATE TABLE IF NOT EXISTS redirects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_path TEXT NOT NULL UNIQUE,
      destination_path TEXT NOT NULL,
      redirect_type INTEGER DEFAULT 301,
      enabled BOOLEAN DEFAULT 1,
      hits INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella backup
  await db.execute(`
    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      size INTEGER,
      tables_included TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  console.log('✅ Tabelle create/verificate');
}

async function createPage(
  slug: string,
  title: string,
  description: string,
  coverImage: string,
  sections: Array<{
    section_type: string;
    title: string | null;
    text: string | null;
    image: string | null;
    href: string | null;
  }>
) {
  const result = await db.execute({
    sql: `INSERT INTO pages (slug, title, description, category, cover_image, published, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [slug, title, description, 'static-page', coverImage, 1, new Date().toISOString()]
  });
  const pageId = Number(result.lastInsertRowid);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    await db.execute({
      sql: `INSERT INTO page_sections (page_id, section_type, title, text, image, href, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [pageId, section.section_type, section.title, section.text, section.image, section.href, i]
    });
  }

  console.log(`  📄 Pagina "${title}" creata (${sections.length} sezioni)`);
  return pageId;
}

async function seed() {
  console.log('\n🚀 Avvio seed database Turso...\n');

  await initDb();

  // Svuota tabelle esistenti
  console.log('🗑️  Pulizia tabelle...');
  await db.execute('DELETE FROM page_sections');
  await db.execute('DELETE FROM pages');
  await db.execute('DELETE FROM menu_items');
  await db.execute('DELETE FROM page_history');

  console.log('\n📝 Creazione pagine...');

  // Homepage
  const threeColumnsData = JSON.stringify([
    {
      title: 'Chi sono',
      text: 'Sono nata a Milano, mi sono laureata in Architettura al Politecnico e poi diplomata in Scenografia all\'Accademia di Brera. Per nove anni sono stata assistente di Pierluigi Pieralli.',
      links: [{ label: 'BIOGRAFIA', href: '/biografia' }]
    },
    {
      title: 'Il mio lavoro',
      text: 'Lavoro come regista e scenografa nell\'ambito del teatro lirico e musicale contemporaneo. Uno degli aspetti per me più appassionanti della mia ricerca è l\'uso del video, un linguaggio che dovrebbe stare in uno stretto rapporto con la musica e la drammaturgia.',
      links: [
        { label: 'OPERE', href: '/opera' },
        { label: 'PRODUZIONI VIDEO', href: '/produzioni-video' }
      ]
    },
    {
      title: 'Il mio processo creativo',
      text: 'Oltre alla lirica, mi piace molto lavorare a nuovi progetti "cross over" dove vari linguaggi possano fondersi. Ed anche progettare installazioni video e realizzare video clips, facendo ateliers artistici con gli allievi del CFPTS a Parigi.',
      links: [{ label: 'INSEGNAMENTO', href: '/insegnamento' }]
    }
  ]);

  await createPage('homepage', 'Home', 'Mietta Corli - Regista, scenografa e video-artista',
    '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg', [
      {
        section_type: 'HeroImageCenter',
        title: '<span style="font-size: 2rem; letter-spacing: 0;">Regista, scenografa, Video-artista</span>',
        text: 'OTELLO, Giuseppe Verdi, nuovo Teatro del Maggio Musicale Fiorentino, 2014',
        image: '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg',
        href: '/contatti'
      },
      {
        section_type: 'ThreeColumnsText',
        title: threeColumnsData,
        text: null,
        image: null,
        href: null
      },
      {
        section_type: 'CtaColoredBg',
        title: 'Progetti in corso d\'opera',
        text: 'CLICCA QUI',
        image: null,
        href: '/progetti-in-corso'
      }
    ]);

  // Biografia
  await createPage('biografia', 'Biografia', 'Biografia di Mietta Corli - Regista, scenografa e video-artista',
    '/uploads/2022/10/IMG_1391-ritagliata.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Biografia',
        text: null,
        image: '/uploads/2022/10/IMG_1391-ritagliata.jpg',
        href: null
      },
      {
        section_type: 'TitleLeftTextRight',
        title: 'Mietta Corli',
        text: BIOGRAFIA_TEXT,
        image: '/uploads/2022/10/IMG_1353.jpg',
        href: null
      },
      {
        section_type: 'CtaColoredBg',
        title: 'Il mio lavoro nella pratica',
        text: 'OPERE',
        image: null,
        href: '/opera'
      }
    ]);

  // Opera
  await createPage('opera', 'Opera', 'Le opere di Mietta Corli - Teatro lirico e musicale',
    '/uploads/2022/10/01_carmina-1600x900-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Opera',
        text: null,
        image: '/uploads/2022/10/01_carmina-1600x900-1.jpg',
        href: null
      },
      {
        section_type: 'TitleTextCentered',
        title: 'Le mie produzioni',
        text: '<p style="text-align: center; max-width: 800px; margin: 0 auto;">Una selezione delle principali produzioni liriche realizzate nei più importanti teatri italiani e internazionali.</p>',
        image: null,
        href: null
      }
    ]);

  // Otello
  await createPage('opera/otello', 'Otello', 'Otello di Giuseppe Verdi - Maggio Musicale Fiorentino 2014',
    '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Otello di Giuseppe Verdi (1887)',
        text: null,
        image: '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg',
        href: null
      },
      {
        section_type: 'TitleLeftTextRight',
        title: 'Maggio Musicale Fiorentino, 2014',
        text: OTELLO_TEXT,
        image: '/uploads/2022/10/077_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4321-scaled-1.jpg',
        href: null
      }
    ]);

  // Carmina Burana
  await createPage('opera/carmina-burana', 'Carmina Burana', 'Carmina Burana di Carl Orff - Teatro Regio di Torino',
    '/uploads/2022/10/01_carmina-1600x900-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Carmina Burana',
        text: null,
        image: '/uploads/2022/10/01_carmina-1600x900-1.jpg',
        href: null
      },
      {
        section_type: 'TitleLeftTextRight',
        title: 'Teatro Regio di Torino',
        text: CARMINA_TEXT,
        image: '/uploads/2022/10/01_carmina-1600x900-1.jpg',
        href: null
      }
    ]);

  // Insegnamento
  await createPage('insegnamento', 'Insegnamento', 'Attività didattica di Mietta Corli - CFPTS Parigi',
    '/uploads/2022/10/01_carmina-1600x900-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Insegnamento',
        text: null,
        image: '/uploads/2022/10/01_carmina-1600x900-1.jpg',
        href: null
      },
      {
        section_type: 'TitleLeftTextRight',
        title: 'CFPTS - Parigi',
        text: INSEGNAMENTO_TEXT,
        image: null,
        href: null
      }
    ]);

  // Produzioni Video
  await createPage('produzioni-video', 'Produzioni Video', 'Produzioni video di Mietta Corli',
    '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Produzioni Video',
        text: null,
        image: '/uploads/2022/10/067_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4234-scaled-1.jpg',
        href: null
      },
      {
        section_type: 'TitleLeftTextRight',
        title: 'Video e teatro musicale',
        text: PRODUZIONI_VIDEO_TEXT,
        image: null,
        href: null
      }
    ]);

  // Progetti in corso
  await createPage('progetti-in-corso', 'Progetti in corso', 'Progetti in corso di Mietta Corli',
    '/uploads/2022/10/077_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4321-scaled-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Progetti in corso d\'opera',
        text: null,
        image: '/uploads/2022/10/077_PROVE-Opening-Gala_HIGH-RES-DEF_MG_4321-scaled-1.jpg',
        href: null
      },
      {
        section_type: 'TitleTextCentered',
        title: 'Work in progress',
        text: PROGETTI_TEXT,
        image: null,
        href: null
      }
    ]);

  // Recensioni
  await createPage('recensioni', 'Recensioni', 'Recensioni delle produzioni di Mietta Corli',
    '/uploads/2022/10/01_carmina-1600x900-1.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Recensioni',
        text: null,
        image: '/uploads/2022/10/01_carmina-1600x900-1.jpg',
        href: null
      },
      {
        section_type: 'TitleTextCentered',
        title: 'Dalla stampa',
        text: RECENSIONI_TEXT,
        image: null,
        href: null
      }
    ]);

  // Contatti
  await createPage('contatti', 'Contatti', 'Contatta Mietta Corli',
    '/uploads/2022/10/IMG_1353.jpg', [
      {
        section_type: 'HeaderImageFull',
        title: 'Contatti',
        text: null,
        image: '/uploads/2022/10/IMG_1353.jpg',
        href: null
      },
      {
        section_type: 'TitleTextCentered',
        title: 'Per informazioni',
        text: CONTATTI_TEXT,
        image: null,
        href: null
      }
    ]);

  // Menu
  console.log('\n🔗 Creazione menu...');
  const menuItems = [
    { label: 'Home', href: '/', order_index: 0 },
    { label: 'Biografia', href: '/biografia', order_index: 1 },
    { label: 'Opera', href: '/opera', order_index: 2 },
    { label: 'Produzioni video', href: '/produzioni-video', order_index: 3 },
    { label: 'Insegnamento', href: '/insegnamento', order_index: 4 },
    { label: 'Progetti in corso', href: '/progetti-in-corso', order_index: 5 },
    { label: 'Recensioni', href: '/recensioni', order_index: 6 },
    { label: 'Contatti', href: '/contatti', order_index: 7 },
  ];

  let operaParentId: number | null = null;

  for (const item of menuItems) {
    const result = await db.execute({
      sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible)
            VALUES (?, ?, ?, ?, ?)`,
      args: [item.label, item.href, null, item.order_index, 1]
    });

    if (item.label === 'Opera') {
      operaParentId = Number(result.lastInsertRowid);
    }
  }

  // Sottomenu Opera
  if (operaParentId) {
    const operaSubmenu = [
      { label: 'Otello', href: '/opera/otello', order_index: 0 },
      { label: 'Carmina Burana', href: '/opera/carmina-burana', order_index: 1 },
    ];

    for (const item of operaSubmenu) {
      await db.execute({
        sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible)
              VALUES (?, ?, ?, ?, ?)`,
        args: [item.label, item.href, operaParentId, item.order_index, 1]
      });
    }
  }

  console.log('  ✅ Menu creato (10 voci)');

  // Site settings
  console.log('\n⚙️  Impostazioni sito...');
  const settings = [
    { key: 'site_name', value: 'Mietta Corli' },
    { key: 'site_tagline', value: 'Regista, Scenografa, Video-Artista' },
    { key: 'contact_email', value: 'info@miettacorli.it' },
    { key: 'footer_copyright', value: '© 2025 Mietta Corli' },
  ];

  for (const setting of settings) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)`,
      args: [setting.key, setting.value]
    });
  }
  console.log('  ✅ Impostazioni salvate');

  console.log('\n✨ Seed completato con successo!\n');
  console.log('📊 Riepilogo:');
  console.log('   - 11 pagine create');
  console.log('   - 10 voci menu');
  console.log('   - 4 impostazioni sito\n');
}

seed().catch(console.error);
