/**
 * Migrazione: Seed Trasforma La Tua Casa
 *
 * Uso:
 *   npx tsx scripts/migrations/006-seed-trasforma-la-tua-casa.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'trasforma-la-tua-casa';
const PAGE_CATEGORY = 'static-page';

const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Progettiamo<br/>insieme',
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/wearstler1-e1614829334490.webp',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Non vendiamo spazi.<br/>
Costruiamo<br/>
visioni condivise.`,
    text: `Progettare la propria casa è un atto di fiducia. Da Sassi Arredamenti, ogni progetto inizia con un incontro: ascoltiamo le tue idee, individuiamo le tue esigenze, ti accompagniamo nella creazione di uno spazio che ti somigli davvero.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'ImageBoxRightFullh',
    title: `Non si tratta di scegliere mobili.<br/>
Si tratta di costruire insieme<br/>
un luogo che ti rappresenti,<br/>
che evolva con te,<br/>
che duri nel tempo.`,
    text: null,
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Castelnuovo%20Rangone%2013GIU251108.webp',
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'fadeRight',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleTextStack',
    title: `Il <b><i>percorso</i></b> che<br/>
affronteremo inseme`,
    text: `Il nostro approccio non lascia nulla al caso.<br/>
Seguiamo ogni fase del progetto con precisione<br/>
e cura, rispettando tempi, budget e desideri.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 3,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'ScrollCards',
    title: null, // uses default cards
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 4,
    animation: 'fadeDown',
    animation_delay: 0.1,
  },
  {
    section_type: 'SocialCtaCombined',
    title: `Seguici sui social<br/>e lasciati ispirare ogni giorno.`,
    text: '@sassiarredamenti',
    image: '/p6.png',
    image_mobile: null,
    href: null,
    order_index: 5,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Trasforma La Tua Casa - Inizio');
  console.log(`   Database: ${process.env.TURSO_DATABASE_URL ? 'Turso (remoto)' : 'file:local.db'}`);
  console.log('');

  try { await db.execute(`ALTER TABLE page_sections ADD COLUMN image_mobile TEXT`); } catch {}
  try { await db.execute(`ALTER TABLE page_sections ADD COLUMN href TEXT`); } catch {}

  const existing = await db.execute({
    sql: 'SELECT id FROM pages WHERE slug = ? AND category = ?',
    args: [PAGE_SLUG, PAGE_CATEGORY],
  });

  let pageId: number;

  if (existing.rows.length > 0) {
    pageId = (existing.rows[0] as any).id;
    console.log(`⚠️  Pagina già esistente (ID: ${pageId})`);
    await db.execute({ sql: 'DELETE FROM page_sections WHERE page_id = ?', args: [pageId] });
    console.log('   Sezioni esistenti eliminate');
  } else {
    const result = await db.execute({
      sql: `INSERT INTO pages (slug, title, description, category, published) VALUES (?, ?, ?, ?, ?)`,
      args: [PAGE_SLUG, 'Trasforma La Tua Casa', 'Progettiamo insieme la tua casa - Sassi Arredamenti', PAGE_CATEGORY, 1],
    });
    pageId = Number(result.lastInsertRowid);
    console.log(`✅ Pagina creata (ID: ${pageId})`);
  }

  console.log('📦 Inserimento sezioni:');
  for (const section of SECTIONS) {
    await db.execute({
      sql: `INSERT INTO page_sections (page_id, section_type, title, text, image, image_mobile, href, order_index, animation, animation_delay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [pageId, section.section_type, section.title, section.text, section.image, section.image_mobile, section.href, section.order_index, section.animation, section.animation_delay],
    });
    console.log(`   ✓ ${section.section_type}`);
  }

  console.log(`\n✅ Migrazione completata! ${SECTIONS.length} sezioni inserite.`);
}

migrate().then(() => process.exit(0)).catch((err) => { console.error('❌ Errore:', err); process.exit(1); });
