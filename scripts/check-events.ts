import { createClient } from '@libsql/client';

// Database di produzione
const db = createClient({
  url: 'libsql://sassi-arredamenti-sassi-arredamenti.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NjU1OTc4NDcsImdpZCI6Ijg3ODNkYmQyLTQyMWMtNDFkNS05ODgxLTQ4MTI3NmMyNTA5ZiIsImlhdCI6MTc2Nzg3OTQ0NywicmlkIjoiZTY2NGQzNGItYTZiNC00MjBlLTllMzItZTE5MDIzMjBhMWFjIn0.1IKW2DkqEvABkDGkj4waHNopsmk8iWWiN-PyRPtGh2vLfPXxR3ctkPDQ-K-BmPcBMB5Sl1-4EuIo3Sgt7ylIAA',
});

async function check() {
  console.log('=== Controllo eventi nel database ===\n');

  // Tutte le pagine
  const allPages = await db.execute('SELECT id, slug, title, category, published FROM pages');
  console.log('Tutte le pagine:');
  for (const page of allPages.rows) {
    console.log(`  ID: ${page.id}, Slug: ${page.slug}, Category: ${page.category}, Published: ${page.published}`);
  }

  console.log('\n--- Eventi (category = eventi, published = 1) ---');
  const events = await db.execute(
    "SELECT id, slug, title, category, published FROM pages WHERE category = 'eventi' AND published = 1"
  );
  console.log(`Trovati: ${events.rows.length} eventi`);
  for (const event of events.rows) {
    console.log(`  ID: ${event.id}, Slug: ${event.slug}, Title: ${event.title}`);
  }
}

check().catch(console.error);
