/**
 * Migrazione: Seed Homepage
 *
 * Questo script crea la homepage nel database utilizzando il sistema page builder.
 * Può essere eseguito sia in locale che in produzione.
 *
 * Uso:
 *   npx tsx scripts/migrations/001-seed-homepage.ts
 *
 * Per produzione (con variabili d'ambiente):
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrations/001-seed-homepage.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const HOMEPAGE_SLUG = 'homepage';
const HOMEPAGE_CATEGORY = 'static-page';

// Sezioni della homepage
const HOMEPAGE_SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'La lunga storia<br/>di chi sa creare<br/><b><i>bellezza.</i></b>',
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/DSC09934.webp',
    order_index: 0,
    animation: 'fadeBlur',
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
  {
    section_type: 'TitleRight',
    title: 'Qui, ogni spazio nasce da<br/>un pensiero condiviso: <i><b>il tuo</b></i>.<br/>E dalla nostra capacità<br/>di tradurlo in forma,<br/>materia, armonia.',
    text: null,
    image: null,
    order_index: 2,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
  {
    section_type: 'ImageLeftTextRight',
    title: 'Dal 1919, tradizione<br/>e innovazione<br/>nell\'arredamento <b><i>su misura.</i></b>',
    text: 'Un sapere che si tramanda, una visione che si evolve. In un tempo in cui tutto scorre veloce, noi crediamo nella solidità delle idee. Barbara e Chiara raccolgono l\'eredità di Enzo Sassi trasformandola in ambienti che uniscono radici profonde e linguaggio contemporaneo. Ogni progetto è unico perché ogni persona lo è.',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/home1919.webp',
    order_index: 3,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeft',
    title: 'Un\'unica regola<br/>guida ogni progetto:<br/>l\'unicità non si improvvisa.<br/><br/>Si costruisce, <i><b>insieme.</b></i>',
    text: null,
    image: null,
    order_index: 4,
    animation: 'fadeDown',
    animation_delay: 0.1,
  },
  {
    section_type: 'BannerWithLink',
    title: 'La nostra filosofia',
    text: 'CHI SIAMO',
    image: '/SassiArr-0758-2.png',
    order_index: 5,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
  {
    section_type: 'ThreeColumnGrid',
    title: null, // usa configurazione default
    text: null,  // usa configurazione default
    image: null,
    order_index: 6,
    animation: 'none',
    animation_delay: 0,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Homepage - Inizio');
  console.log(`   Database: ${process.env.TURSO_DATABASE_URL ? 'Turso (remoto)' : 'file:local.db'}`);
  console.log('');

  // 1. Verifica se la homepage esiste già
  const existing = await db.execute({
    sql: 'SELECT id FROM pages WHERE slug = ? AND category = ?',
    args: [HOMEPAGE_SLUG, HOMEPAGE_CATEGORY],
  });

  let pageId: number;

  if (existing.rows.length > 0) {
    pageId = (existing.rows[0] as any).id;
    console.log(`⚠️  Homepage già esistente (ID: ${pageId})`);

    // Elimina le sezioni esistenti
    await db.execute({
      sql: 'DELETE FROM page_sections WHERE page_id = ?',
      args: [pageId],
    });
    console.log('   Sezioni esistenti eliminate');
  } else {
    // 2. Crea la pagina homepage
    const result = await db.execute({
      sql: `INSERT INTO pages (slug, title, description, category, published)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        HOMEPAGE_SLUG,
        'Home',
        'Sassi Arredamenti - Dal 1919, arredamento su misura',
        HOMEPAGE_CATEGORY,
        1, // published
      ],
    });
    pageId = Number(result.lastInsertRowid);
    console.log(`✅ Pagina homepage creata (ID: ${pageId})`);
  }

  // 3. Inserisci le sezioni
  console.log('');
  console.log('📦 Inserimento sezioni:');

  for (const section of HOMEPAGE_SECTIONS) {
    await db.execute({
      sql: `INSERT INTO page_sections
            (page_id, section_type, title, text, image, order_index, animation, animation_delay)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        pageId,
        section.section_type,
        section.title,
        section.text,
        section.image,
        section.order_index,
        section.animation,
        section.animation_delay,
      ],
    });
    console.log(`   ✓ ${section.section_type} (ordine: ${section.order_index})`);
  }

  console.log('');
  console.log(`✅ Migrazione completata! ${HOMEPAGE_SECTIONS.length} sezioni inserite.`);
  console.log('');
  console.log('📍 La homepage sarà disponibile su:');
  console.log(`   - Admin: /admin/pages/${pageId}`);
  console.log(`   - Frontend: / (dopo aver aggiornato src/app/page.tsx)`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Errore durante la migrazione:', err);
    process.exit(1);
  });
