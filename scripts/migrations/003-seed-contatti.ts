/**
 * Migrazione: Seed Contatti
 *
 * Questo script crea la pagina "Contatti" nel database utilizzando il sistema page builder.
 * Può essere eseguito sia in locale che in produzione.
 *
 * Uso:
 *   npx tsx scripts/migrations/003-seed-contatti.ts
 *
 * Per produzione (con variabili d'ambiente):
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrations/003-seed-contatti.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'contatti';
const PAGE_CATEGORY = 'static-page';

// Sezioni della pagina Contatti
const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Mettiamoci<br/> in contatto',
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/contatti.webp',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'NumberedStepsGrid',
    title: JSON.stringify([
      { number: '1', title: 'telefono: 059 795034', bgColor: '#F2F2F2', borderColor: '#848189' },
      { number: '2', title: 'progettazione@sassiarreda.it', bgColor: '#E9E7E4', borderColor: '#5C5449' },
      { number: '3', title: `Via Massimo d'Azeglio, 1271<br/>41052 Rocca Malatina`, bgColor: '#F2F2F2', borderColor: '#5C5449' },
    ]),
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'GoogleMap',
    title: `Via Massimo d'Azeglio, 1271, 41052 Rocca Malatina`,
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleCenterImage',
    title: `Seguici sui social<br/>
e lasciati ispirare ogni giorno.`,
    text: null,
    image: '/p6.png',
    image_mobile: null,
    href: null,
    order_index: 3,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Contatti - Inizio');
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
        'Contatti',
        'Contattaci - Sassi Arredamenti',
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
  console.log(`   - Frontend: /contatti`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Errore durante la migrazione:', err);
    process.exit(1);
  });
