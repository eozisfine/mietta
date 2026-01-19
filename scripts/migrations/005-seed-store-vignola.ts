/**
 * Migrazione: Seed Store Vignola
 *
 * Uso:
 *   npx tsx scripts/migrations/005-seed-store-vignola.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'store-vignola';
const PAGE_CATEGORY = 'static-page';

const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Store di<br/>Vignola',
    text: null,
    image: 'store.png',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Dove ogni stagione<br/>è un'occasione<br/>per stupire`,
    text: `Le nostre vetrine a Vignola non si limitano a mostrare prodotti: raccontano storie.<br/><br/>Ogni stagione, ogni nuova ambientazione è pensata per sorprendere, ispirare, dialogare con il tempo presente.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'ImageBoxRightFullh',
    title: `Dietro ogni allestimento<br/>cè la volontà di offrire <br/>qualcosa di più.`,
    text: null,
    image: 'stor3.png',
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'fadeRight',
    animation_delay: 0.1,
  },
  {
    section_type: 'EventsGrid',
    title: 'vetrina', // categoria eventi
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 3,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Un segnale forte e chiaro:<br/>Sassi Arredamenti è tradizione viva, <br/>capace di evolvere senza perdere identità.`,
    text: `Tre o quattro volte l'anno, il nostro store si rinnova.<br/>Nuove proposte, nuovi stili, nuovi materiali: <br/>un racconto continuo di idee e possibilità.<br/><br/>La vetrina diventa così un appuntamento atteso, capace di creare passaparola, ispirare desideri, <br/>aprire immaginazioni.`,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 4,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'CtaImageLeft',
    title: `Facciamo insieme<br/>il <i><b>primo passo</b></i>.`,
    text: 'Prenota ora la tua consulenza gratuita.',
    image: 'f7.png',
    image_mobile: null,
    href: '/contatti',
    order_index: 5,
    animation: 'fadeIn',
    animation_delay: 0.1,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Store Vignola - Inizio');
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
      args: [PAGE_SLUG, 'Store Vignola', 'Il nostro store a Vignola - Sassi Arredamenti', PAGE_CATEGORY, 1],
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
