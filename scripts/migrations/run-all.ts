/**
 * Script per eseguire tutte le migrazioni
 *
 * Uso:
 *   npx tsx scripts/migrations/run-all.ts
 *
 * Per produzione:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrations/run-all.ts
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const migrationsDir = path.dirname(new URL(import.meta.url).pathname);

// Su Windows, rimuove il primo slash dal path
const normalizedDir = process.platform === 'win32'
  ? migrationsDir.replace(/^\//, '').replace(/\//g, '\\')
  : migrationsDir;

const migrations = fs.readdirSync(normalizedDir)
  .filter(file => file.match(/^\d{3}-.*\.ts$/) && file !== 'run-all.ts')
  .sort();

console.log('🚀 Esecuzione migrazioni database\n');
console.log(`   Database: ${process.env.TURSO_DATABASE_URL ? 'Turso (remoto)' : 'file:local.db'}`);
console.log(`   Migrazioni trovate: ${migrations.length}\n`);

for (const migration of migrations) {
  const migrationPath = path.join(normalizedDir, migration);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${migration}`);
  console.log('='.repeat(60));

  try {
    // Passa le variabili d'ambiente allo script figlio
    const env = { ...process.env };
    execSync(`npx tsx "${migrationPath}"`, {
      stdio: 'inherit',
      env
    });
    console.log(`✅ ${migration} completato`);
  } catch (error) {
    console.error(`❌ Errore in ${migration}`);
    process.exit(1);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('🎉 Tutte le migrazioni completate con successo!');
console.log('='.repeat(60));
