/**
 * Migrazione: Seed Progetti
 *
 * Questo script crea la pagina "Progetti" nel database utilizzando il sistema page builder.
 * Può essere eseguito sia in locale che in produzione.
 *
 * Uso:
 *   npx tsx scripts/migrations/004-seed-progetti.ts
 *
 * Per produzione (con variabili d'ambiente):
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrations/004-seed-progetti.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'progetti';
const PAGE_CATEGORY = 'static-page';

// Sezioni della pagina Progetti
const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Progetti<br/>selezionati',
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Castelnuovo%20Rangone%2013GIU251097.webp',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Quando il progetto diventa spazio,<br/>
lo spazio racconta chi sei.`,
    text: `Ogni progetto che realizziamo è il risultato di un percorso condiviso, di un'idea che prende forma attraverso il confronto, la tecnica e la cura per il dettaglio.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleTextCentered',
    title: `Ciò che amiamo <b><i>creare.</i></b>`,
    text: 'Ci dedichiamo con particolare passione a:',
    image: null,
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'fadeRight',
    animation_delay: 0.1,
  },
  {
    section_type: 'ProjectCategory',
    title: 'Open space',
    text: `La sapienza di abbattere<br/>
i confini senza perdere intimità`,
    image: '/pr4.png',
    image_mobile: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Castelnuovo%20Rangone%2013GIU251108.jpg',
    href: null,
    order_index: 3,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'ProjectCategory',
    title: 'Sale cucine',
    text: `L'anima della casa,<br/>
progettate come veri centri vitali`,
    image: '/pr5.png',
    image_mobile: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253541.jpg',
    href: null,
    order_index: 4,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'ProjectCategory',
    title: 'Decorazioni artigianali',
    text: `La sapienza di abbattere i confini<br/>
senza perdere intimità`,
    image: '/pr6.png',
    image_mobile: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253445.jpg',
    href: null,
    order_index: 5,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'TextCenterTitleText',
    title: `I nostri progetti<br/>
raccontano chi siamo`,
    text: `Qui troverai una selezione dei nostri lavori più rappresentativi: redesign completi di abitazioni dove ogni scelta, dal layout alle finiture, riflette
il nostro metodo e il nostro sguardo.
<br/><br/>
Progetti pensati per chi non cerca una casa qualsiasi, ma la propria casa.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 6,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'ProjectShowcase',
    title: `Villa in<br/>campagna`,
    text: 'right', // posizione immagine
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253420.jpg',
    image_mobile: null,
    href: '/villa-in-campagna',
    order_index: 7,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'ProjectShowcase',
    title: `Villetta<br/>indipendente`,
    text: 'left', // posizione immagine
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Castelnuovo%20Rangone%2013GIU251070.jpg',
    image_mobile: null,
    href: '/villetta-indipendente',
    order_index: 8,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'InstagramCta',
    title: `Scopri i nostri<br/>ultimi progetti!`,
    text: '@sassiarredamenti',
    image: '/instagram.png',
    image_mobile: null,
    href: null,
    order_index: 9,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'CtaImageLeft',
    title: `Lasciati ispirare<br/>
dal nostro <b><i>metodo.</i></b>`,
    text: 'Prenota ora la tua consulenza gratuita.',
    image: 'f7.png',
    image_mobile: null,
    href: '/contatti',
    order_index: 10,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Progetti - Inizio');
  console.log(`   Database: ${process.env.TURSO_DATABASE_URL ? 'Turso (remoto)' : 'file:local.db'}`);
  console.log('');

  // Migrazione colonne se necessario
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN image_mobile TEXT`);
    console.log('   ✓ Colonna image_mobile aggiunta');
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN href TEXT`);
    console.log('   ✓ Colonna href aggiunta');
  } catch { /* colonna già esistente */ }

  // 1. Verifica se la pagina esiste già
  const existing = await db.execute({
    sql: 'SELECT id FROM pages WHERE slug = ? AND category = ?',
    args: [PAGE_SLUG, PAGE_CATEGORY],
  });

  let pageId: number;

  if (existing.rows.length > 0) {
    pageId = (existing.rows[0] as any).id;
    console.log(`⚠️  Pagina già esistente (ID: ${pageId})`);

    // Elimina le sezioni esistenti
    await db.execute({
      sql: 'DELETE FROM page_sections WHERE page_id = ?',
      args: [pageId],
    });
    console.log('   Sezioni esistenti eliminate');
  } else {
    // 2. Crea la pagina
    const result = await db.execute({
      sql: `INSERT INTO pages (slug, title, description, category, published)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        PAGE_SLUG,
        'Progetti',
        'I nostri progetti selezionati - Sassi Arredamenti',
        PAGE_CATEGORY,
        1, // published
      ],
    });
    pageId = Number(result.lastInsertRowid);
    console.log(`✅ Pagina creata (ID: ${pageId})`);
  }

  // 3. Inserisci le sezioni
  console.log('');
  console.log('📦 Inserimento sezioni:');

  for (const section of SECTIONS) {
    await db.execute({
      sql: `INSERT INTO page_sections
            (page_id, section_type, title, text, image, image_mobile, href, order_index, animation, animation_delay)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        pageId,
        section.section_type,
        section.title,
        section.text,
        section.image,
        section.image_mobile,
        section.href,
        section.order_index,
        section.animation,
        section.animation_delay,
      ],
    });
    console.log(`   ✓ ${section.section_type} (ordine: ${section.order_index})`);
  }

  console.log('');
  console.log(`✅ Migrazione completata! ${SECTIONS.length} sezioni inserite.`);
  console.log('');
  console.log('📍 La pagina sarà disponibile su:');
  console.log(`   - Admin: /admin/pages/${pageId}`);
  console.log(`   - Frontend: /progetti`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Errore durante la migrazione:', err);
    process.exit(1);
  });
