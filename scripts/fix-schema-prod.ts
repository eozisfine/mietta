import { createClient } from '@libsql/client';

// Database di produzione
const db = createClient({
  url: 'libsql://sassi-arredamenti-sassi-arredamenti.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NjU1OTc4NDcsImdpZCI6Ijg3ODNkYmQyLTQyMWMtNDFkNS05ODgxLTQ4MTI3NmMyNTA5ZiIsImlhdCI6MTc2Nzg3OTQ0NywicmlkIjoiZTY2NGQzNGItYTZiNC00MjBlLTllMzItZTE5MDIzMjBhMWFjIn0.1IKW2DkqEvABkDGkj4waHNopsmk8iWWiN-PyRPtGh2vLfPXxR3ctkPDQ-K-BmPcBMB5Sl1-4EuIo3Sgt7ylIAA',
});

async function fix() {
  console.log('=== Fixing PRODUCTION database schema ===\n');

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
  console.log('\nSchema tabella pages (PROD):');
  for (const col of schema.rows) {
    console.log(`  - ${col.name} (${col.type})`);
  }
}

fix().catch(console.error);
