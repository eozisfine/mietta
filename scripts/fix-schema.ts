import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fix() {
  console.log('=== Fixing database schema ===\n');

  try {
    // Aggiungi colonna cover_image se non esiste
    await db.execute(`ALTER TABLE pages ADD COLUMN cover_image TEXT`);
    console.log('Colonna cover_image aggiunta!');
  } catch (error: any) {
    if (error.message?.includes('duplicate column')) {
      console.log('Colonna cover_image già esistente');
    } else {
      console.error('Errore:', error.message);
    }
  }

  // Verifica schema
  const schema = await db.execute(`PRAGMA table_info(pages)`);
  console.log('\nSchema tabella pages:');
  for (const col of schema.rows) {
    console.log(`  - ${col.name} (${col.type})`);
  }
}

fix().catch(console.error);
