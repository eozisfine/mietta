import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  // Tabella pagine dinamiche
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

  // Tabella sezioni per ogni pagina
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
      order_index INTEGER NOT NULL,
      animation TEXT DEFAULT 'fadeUp',
      animation_delay REAL DEFAULT 0.1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

  // Migrazione: aggiunge colonne se non esistono (per DB esistenti)
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN image_mobile TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN href TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN button_text TEXT`);
  } catch { /* colonna già esistente */ }

  // v1.1: Parallax, spacing, visibility
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN image_fixed BOOLEAN DEFAULT 0`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN padding_top TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN padding_bottom TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN margin_top TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN margin_bottom TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN visible_from TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE page_sections ADD COLUMN hidden_from TEXT`);
  } catch { /* colonna già esistente */ }

  // Migrazione SEO per pages
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN published_at DATETIME`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN seo_title TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN seo_description TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN seo_keywords TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN seo_og_image TEXT`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE pages ADD COLUMN seo_no_index BOOLEAN DEFAULT 0`);
  } catch { /* colonna già esistente */ }

  // Tabella storico modifiche pagina (include modifiche sezioni)
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

  // Tabella menu navigazione
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

  // Migrazione per aggiungere colonne dropdown se non esistono
  try {
    await db.execute(`ALTER TABLE menu_items ADD COLUMN is_dynamic_dropdown BOOLEAN DEFAULT 0`);
  } catch { /* colonna già esistente */ }
  try {
    await db.execute(`ALTER TABLE menu_items ADD COLUMN dropdown_source TEXT`);
  } catch { /* colonna già esistente */ }

  // Tabella impostazioni sito
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

  // Tabella messaggi contatto
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
}
