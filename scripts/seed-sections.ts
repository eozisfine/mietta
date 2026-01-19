import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log('Inizializzazione database...');

  // Crea la tabella
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_type TEXT NOT NULL,
      title TEXT,
      text TEXT,
      image TEXT,
      order_index INTEGER NOT NULL,
      animation TEXT DEFAULT 'fadeUp',
      animation_delay REAL DEFAULT 0.1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Tabella creata/verificata.');

  // Verifica se ci sono già dati
  const existing = await db.execute('SELECT COUNT(*) as count FROM sections');
  if ((existing.rows[0] as any).count > 0) {
    console.log('Il database contiene già dati. Vuoi sovrascrivere? (salta per ora)');
    return;
  }

  console.log('Inserimento dati di esempio...');

  // Inserisci le sezioni di esempio
  const sections = [
    {
      section_type: 'HeaderImageFull',
      title: 'La lunga storia<br/>di chi sa creare<br/><b><i>bellezza</i></b>',
      text: null,
      image: 'HomeHead.png',
      order_index: 0,
      animation: 'fadeUp',
      animation_delay: 0.1,
    },
    {
      section_type: 'TitleLeftTextRight',
      title: 'Sassi arredamenti:<br/>un atelier dove valore e <br/>design si incontrano.',
      text: 'Dal 1919, a Rocca Malatina, coltiviamo l\'arte di progettare ambienti che resistono al tempo. Tre generazioni, una tradizione familiare che si rinnova con lo sguardo rivolto al futuro: cura artigianale, visione progettuale, eleganza contemporanea.',
      image: null,
      order_index: 1,
      animation: 'fadeLeft',
      animation_delay: 0.1,
    },
  ];

  for (const section of sections) {
    await db.execute({
      sql: `INSERT INTO sections (section_type, title, text, image, order_index, animation, animation_delay)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        section.section_type,
        section.title,
        section.text,
        section.image,
        section.order_index,
        section.animation,
        section.animation_delay,
      ],
    });
  }

  console.log(`✓ ${sections.length} sezioni inserite con successo!`);
  console.log('\nVai su http://localhost:3001/admin per gestire le sezioni');
}

seed().catch(console.error);
