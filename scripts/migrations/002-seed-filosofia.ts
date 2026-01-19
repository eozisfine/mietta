/**
 * Migrazione: Seed Filosofia
 *
 * Questo script crea la pagina "Filosofia" nel database utilizzando il sistema page builder.
 * Può essere eseguito sia in locale che in produzione.
 *
 * Uso:
 *   npx tsx scripts/migrations/002-seed-filosofia.ts
 *
 * Per produzione (con variabili d'ambiente):
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrations/002-seed-filosofia.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'filosofia';
const PAGE_CATEGORY = 'static-page';

// Sezioni della pagina Filosofia
const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Conosciamoci',
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Rectangle%2011.webp',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Ogni progetto nasce<br/>
dall'incontro tra<br/>
il tuo desiderio<br/>
e il nostro rigore`,
    text: `In un mondo che corre veloce, noi scegliamo di rallentare. Di ascoltare prima di proporre, di osservare prima di progettare. Di costruire spazi che rispecchiano chi sei, senza mai cedere alla banalità del già visto.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'ImageBoxLeftFullh',
    title: `La nostra promessa:<br/>
<br/>
<i>chiarezza,</i><br/>
<i>solidità,</i><br/>
<i>bellezza.</i><br/>`,
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253420.webp',
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'fadeDown',
    animation_delay: 0.1,
  },
  {
    section_type: 'TextBoxRight',
    title: `Non offriamo soluzioni<br/>
<i><b>preconfezionate.</b></i>`,
    text: `Affianchiamo ogni cliente in un percorso<br/>
rigoroso che parte da una consulenza<br/>
gratuita e si sviluppa attraverso:`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 3,
    animation: 'fadeRight',
    animation_delay: 0.1,
  },
  {
    section_type: 'NumberedStepsGrid',
    title: JSON.stringify([
      { number: '1', title: 'Analisi delle esigenze<br/>e sopralluogo', bgColor: '#F2F2F2', borderColor: '#848189' },
      { number: '2', title: 'Studio degli spazi<br/>proposta progettuale<br/>con render dedicato', bgColor: '#E9E7E4', borderColor: '#5C5449' },
      { number: '3', title: 'Realizzazione e montaggio<br/>affidato esclusivamente<br/>al nostro team interno', bgColor: '#F2F2F2', borderColor: '#5C5449' },
    ]),
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 4,
    animation: 'none',
    animation_delay: 0,
  },
  {
    section_type: 'ImageTextOverlayLeft',
    title: `Crediamo<br/>
che ogni <i><b>casa</b></i><br/>
debba parlare<br/>
di chi la <i><b>abita.</b></i><br/>`,
    text: `Per questo, i nostri progetti non replicano<br/> formule standard:
nascono da una<br/> progettazione sartoriale che combina<br/> estetica,
funzionalità e materiali selezionati.<br/>
<br/>
Chi si affida a noi sceglie ambienti che<br/> durano nel tempo.<br/>
Perché un progetto ben pensato non<br/> invecchia: si evolve con te.`,
    image: '/f6.png',
    image_mobile: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253511.jpg',
    href: null,
    order_index: 5,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'CtaImageLeft',
    title: `Facciamo insieme<br/>
il <i><b>primo passo</b></i>.`,
    text: 'Prenota ora la tua consulenza gratuita.',
    image: 'f7.png',
    image_mobile: null,
    href: '/contatti',
    order_index: 6,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Filosofia - Inizio');
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
        'Filosofia',
        'La nostra filosofia - Sassi Arredamenti',
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
  console.log(`   - Frontend: /filosofia (dopo aver configurato il routing)`);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Errore durante la migrazione:', err);
    process.exit(1);
  });
