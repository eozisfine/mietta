import { createClient } from '@libsql/client';
import crypto from 'crypto';

const db = createClient({
  url: 'libsql://sassi-arredamenti-sassi-arredamenti.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NjU1OTc4NDcsImdpZCI6Ijg3ODNkYmQyLTQyMWMtNDFkNS05ODgxLTQ4MTI3NmMyNTA5ZiIsImlhdCI6MTc2Nzg3OTQ0NywicmlkIjoiZTY2NGQzNGItYTZiNC00MjBlLTllMzItZTE5MDIzMjBhMWFjIn0.1IKW2DkqEvABkDGkj4waHNopsmk8iWWiN-PyRPtGh2vLfPXxR3ctkPDQ-K-BmPcBMB5Sl1-4EuIo3Sgt7ylIAA'
});

// Funzione hash password (semplice per ora, dovresti usare bcrypt in produzione)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Connessione al database di produzione...\n');

  // 1. Trova la pagina /eventi/ci-prendiamo-cura
  console.log('1. Cercando la pagina eventi/ci-prendiamo-cura...');
  const pageResult = await db.execute({
    sql: `SELECT * FROM pages WHERE slug = ?`,
    args: ['eventi/ci-prendiamo-cura']
  });

  if (pageResult.rows.length === 0) {
    console.log('   ❌ Pagina non trovata!');

    // Proviamo a cercare pagine simili
    const allPages = await db.execute(`SELECT id, slug, title, category FROM pages ORDER BY category, slug`);
    console.log('\n   Tutte le pagine esistenti:');
    allPages.rows.forEach(p => console.log(`   - [${p.category}] ${p.slug} (${p.title})`));
    return;
  }

  const page = pageResult.rows[0];
  console.log(`   ✅ Pagina trovata: ID=${page.id}, title="${page.title}"`);

  // 2. Trova le sezioni della pagina
  console.log('\n2. Recuperando le sezioni della pagina...');
  const sectionsResult = await db.execute({
    sql: `SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index`,
    args: [page.id]
  });
  console.log(`   ✅ Trovate ${sectionsResult.rows.length} sezioni`);

  // 3. Crea una copia della pagina
  console.log('\n3. Creando copia della pagina...');
  const newSlug = 'eventi/ci-prendiamo-cura-copia';

  // Controlla se esiste già
  const existingCopy = await db.execute({
    sql: `SELECT id FROM pages WHERE slug = ?`,
    args: [newSlug]
  });

  if (existingCopy.rows.length > 0) {
    console.log(`   ⚠️  La pagina ${newSlug} esiste già (ID=${existingCopy.rows[0].id})`);
  } else {
    const insertPage = await db.execute({
      sql: `INSERT INTO pages (slug, title, description, category, cover_image, published, published_at, seo_title, seo_description, seo_keywords, seo_og_image, seo_no_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newSlug,
        page.title + ' (Copia)',
        page.description,
        page.category,
        page.cover_image,
        page.published,
        page.published_at,
        page.seo_title,
        page.seo_description,
        page.seo_keywords,
        page.seo_og_image,
        page.seo_no_index
      ]
    });

    const newPageId = insertPage.lastInsertRowid;
    console.log(`   ✅ Pagina creata con ID=${newPageId}`);

    // 4. Copia le sezioni
    console.log('\n4. Copiando le sezioni...');
    for (const section of sectionsResult.rows) {
      await db.execute({
        sql: `INSERT INTO page_sections (page_id, section_type, title, text, image, image_mobile, href, order_index, animation, animation_delay)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newPageId,
          section.section_type,
          section.title,
          section.text,
          section.image,
          section.image_mobile,
          section.href,
          section.order_index,
          section.animation,
          section.animation_delay
        ]
      });
    }
    console.log(`   ✅ Copiate ${sectionsResult.rows.length} sezioni`);
  }

  // 5. Crea gli utenti
  console.log('\n5. Creando gli utenti...');

  const users = [
    { email: 'zoeroversigiusti1@gmail.com', password: 'Sassi2024!Zoe' },
    { email: 'emmebianche@gmail.com', password: 'Sassi2024!Emme' }
  ];

  for (const user of users) {
    // Controlla se esiste già
    const existingUser = await db.execute({
      sql: `SELECT id FROM users WHERE email = ?`,
      args: [user.email]
    });

    if (existingUser.rows.length > 0) {
      console.log(`   ⚠️  Utente ${user.email} esiste già`);
    } else {
      const passwordHash = hashPassword(user.password);
      await db.execute({
        sql: `INSERT INTO users (email, password_hash, role, enabled) VALUES (?, ?, 'admin', 1)`,
        args: [user.email, passwordHash]
      });
      console.log(`   ✅ Creato utente: ${user.email}`);
    }
  }

  console.log('\n========================================');
  console.log('CREDENZIALI UTENTI CREATI:');
  console.log('========================================');
  users.forEach(u => {
    console.log(`Email: ${u.email}`);
    console.log(`Password: ${u.password}`);
    console.log('---');
  });
  console.log('========================================\n');

  console.log('✅ Operazioni completate!');
}

main().catch(console.error);
