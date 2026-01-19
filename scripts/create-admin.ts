/**
 * Script per creare il primo utente admin
 *
 * Esegui con: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function main() {
  const email = process.argv[2] || 'admin@sassi.it';
  const password = process.argv[3] || 'admin123';

  console.log('Creazione tabella users...');

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

  // Verifica se esiste già
  const existing = await db.execute({
    sql: `SELECT id FROM users WHERE email = ?`,
    args: [email],
  });

  if (existing.rows.length > 0) {
    console.log(`Utente ${email} esiste già. Aggiorno la password...`);
    const passwordHash = await hashPassword(password);
    await db.execute({
      sql: `UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE email = ?`,
      args: [passwordHash, email],
    });
    console.log('Password aggiornata!');
  } else {
    const passwordHash = await hashPassword(password);
    await db.execute({
      sql: `INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')`,
      args: [email, passwordHash],
    });
    console.log(`Utente admin creato: ${email}`);
  }

  console.log('\n=== Credenziali ===');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\nOra puoi accedere a /admin/login');
}

main().catch(console.error);
