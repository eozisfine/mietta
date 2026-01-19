/**
 * Migrazione: Seed Villetta Indipendente
 *
 * Uso:
 *   npx tsx scripts/migrations/008-seed-villetta-indipendente.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PAGE_SLUG = 'villetta-indipendente';
const PAGE_CATEGORY = 'static-page';

const PHOTOS = [
  { src: "/villetta-indipendente/img.png", width: 773, height: 478 },
  { src: "/villetta-indipendente/img_1.png", width: 367, height: 327 },
  { src: "/villetta-indipendente/img_2.png", width: 714, height: 336 },
  { src: "/villetta-indipendente/img_3.png", width: 838, height: 559 },
  { src: "/villetta-indipendente/img_4.png", width: 378, height: 336 },
  { src: "/villetta-indipendente/img_5.png", width: 707, height: 336 },
  { src: "/villetta-indipendente/img_6.png", width: 1294, height: 509 },
  { src: "/villetta-indipendente/img_7.png", width: 367, height: 635 },
  { src: "/villetta-indipendente/img_8.png", width: 839, height: 635 },
];

const SECTIONS = [
  {
    section_type: 'HeaderImageFull',
    title: 'Villetta<br/>indipendente',
    text: null,
    image: 'villetta-indipendente/header.png',
    image_mobile: null,
    href: null,
    order_index: 0,
    animation: 'fadeUp',
    animation_delay: 0.1,
  },
  {
    section_type: 'TitleLeftTextRight',
    title: `Interni di design<br/><span style="font-size: 50%">progettazione e realizzazione Sassi Arredamenti</span>`,
    text: '',
    image: null,
    image_mobile: null,
    href: null,
    order_index: 1,
    animation: 'fadeLeft',
    animation_delay: 0.1,
  },
  {
    section_type: 'PhotoGallery',
    title: JSON.stringify(PHOTOS),
    text: null,
    image: null,
    image_mobile: null,
    href: null,
    order_index: 2,
    animation: 'none',
    animation_delay: 0,
  },
];

async function migrate() {
  console.log('🚀 Migrazione Villetta Indipendente - Inizio');
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
      args: [PAGE_SLUG, 'Villetta Indipendente', 'Progetto Villetta Indipendente - Sassi Arredamenti', PAGE_CATEGORY, 1],
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
