import { createClient } from '@libsql/client';
import crypto from 'crypto';

// Database locale
const localDb = createClient({
  url: 'file:local.db'
});

// Database produzione
const prodDb = createClient({
  url: 'libsql://sassi-arredamenti-sassi-arredamenti.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NjU1OTc4NDcsImdpZCI6Ijg3ODNkYmQyLTQyMWMtNDFkNS05ODgxLTQ4MTI3NmMyNTA5ZiIsImlhdCI6MTc2Nzg3OTQ0NywicmlkIjoiZTY2NGQzNGItYTZiNC00MjBlLTllMzItZTE5MDIzMjBhMWFjIn0.1IKW2DkqEvABkDGkj4waHNopsmk8iWWiN-PyRPtGh2vLfPXxR3ctkPDQ-K-BmPcBMB5Sl1-4EuIo3Sgt7ylIAA'
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('='.repeat(50));
  console.log('SINCRONIZZAZIONE DB LOCALE -> PRODUZIONE');
  console.log('='.repeat(50));

  // 1. Leggi tutte le pagine dal DB locale
  console.log('\n1. Leggendo pagine dal database locale...');
  const localPages = await localDb.execute(`SELECT * FROM pages ORDER BY id`);
  console.log(`   Trovate ${localPages.rows.length} pagine locali`);

  if (localPages.rows.length === 0) {
    console.log('   ❌ Nessuna pagina nel database locale!');
    return;
  }

  // Mostra le pagine locali
  console.log('\n   Pagine locali:');
  localPages.rows.forEach(p => console.log(`   - [${p.category}] ${p.slug}`));

  // 2. Per ogni pagina locale, copiala in produzione
  console.log('\n2. Sincronizzando pagine in produzione...');

  const idMapping = {}; // Mappa vecchio ID -> nuovo ID

  for (const page of localPages.rows) {
    // Controlla se esiste già in produzione
    const existing = await prodDb.execute({
      sql: `SELECT id FROM pages WHERE slug = ?`,
      args: [page.slug]
    });

    let newPageId;

    if (existing.rows.length > 0) {
      // Aggiorna pagina esistente
      newPageId = existing.rows[0].id;
      await prodDb.execute({
        sql: `UPDATE pages SET
              title = ?, description = ?, category = ?, cover_image = ?,
              published = ?, published_at = ?, seo_title = ?, seo_description = ?,
              seo_keywords = ?, seo_og_image = ?, seo_no_index = ?, updated_at = CURRENT_TIMESTAMP
              WHERE slug = ?`,
        args: [
          page.title, page.description, page.category, page.cover_image,
          page.published, page.published_at, page.seo_title, page.seo_description,
          page.seo_keywords, page.seo_og_image, page.seo_no_index, page.slug
        ]
      });
      console.log(`   ✏️  Aggiornata: ${page.slug}`);

      // Elimina le vecchie sezioni
      await prodDb.execute({
        sql: `DELETE FROM page_sections WHERE page_id = ?`,
        args: [newPageId]
      });
    } else {
      // Inserisci nuova pagina
      const result = await prodDb.execute({
        sql: `INSERT INTO pages (slug, title, description, category, cover_image, published, published_at, seo_title, seo_description, seo_keywords, seo_og_image, seo_no_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          page.slug, page.title, page.description, page.category, page.cover_image,
          page.published, page.published_at, page.seo_title, page.seo_description,
          page.seo_keywords, page.seo_og_image, page.seo_no_index
        ]
      });
      newPageId = result.lastInsertRowid;
      console.log(`   ✅ Creata: ${page.slug}`);
    }

    idMapping[page.id] = newPageId;

    // 3. Copia le sezioni
    const localSections = await localDb.execute({
      sql: `SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index`,
      args: [page.id]
    });

    for (const section of localSections.rows) {
      await prodDb.execute({
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

    if (localSections.rows.length > 0) {
      console.log(`      └── ${localSections.rows.length} sezioni`);
    }
  }

  // 4. Sincronizza il menu
  console.log('\n3. Sincronizzando il menu...');

  // Prima leggi il menu locale
  const localMenu = await localDb.execute(`SELECT * FROM menu_items ORDER BY parent_id NULLS FIRST, order_index`);
  console.log(`   Trovate ${localMenu.rows.length} voci menu locali`);

  if (localMenu.rows.length > 0) {
    // Cancella tutto il menu in produzione
    await prodDb.execute(`DELETE FROM menu_items`);
    console.log('   Rimosso menu esistente in produzione');

    // Mappa per i nuovi ID
    const menuIdMapping = {};

    // Prima inserisci le voci root (senza parent_id)
    for (const item of localMenu.rows.filter(i => !i.parent_id)) {
      const result = await prodDb.execute({
        sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          item.label,
          item.href,
          null,
          item.order_index,
          item.visible,
          item.open_in_new_tab,
          item.is_dynamic_dropdown,
          item.dropdown_source
        ]
      });
      menuIdMapping[item.id] = result.lastInsertRowid;
      console.log(`   ✅ ${item.label}`);
    }

    // Poi inserisci le voci figlie
    for (const item of localMenu.rows.filter(i => i.parent_id)) {
      const newParentId = menuIdMapping[item.parent_id];
      await prodDb.execute({
        sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          item.label,
          item.href,
          newParentId,
          item.order_index,
          item.visible,
          item.open_in_new_tab,
          item.is_dynamic_dropdown,
          item.dropdown_source
        ]
      });
      console.log(`      └── ${item.label}`);
    }
  }

  // 5. Crea gli utenti
  console.log('\n4. Verificando gli utenti...');

  const users = [
    { email: 'zoeroversigiusti1@gmail.com', password: 'Sassi2024!Zoe' },
    { email: 'emmebianche@gmail.com', password: 'Sassi2024!Emme' }
  ];

  for (const user of users) {
    const existingUser = await prodDb.execute({
      sql: `SELECT id FROM users WHERE email = ?`,
      args: [user.email]
    });

    if (existingUser.rows.length > 0) {
      console.log(`   ⚠️  Utente ${user.email} esiste già`);
    } else {
      const passwordHash = hashPassword(user.password);
      await prodDb.execute({
        sql: `INSERT INTO users (email, password_hash, role, enabled) VALUES (?, ?, 'admin', 1)`,
        args: [user.email, passwordHash]
      });
      console.log(`   ✅ Creato: ${user.email}`);
    }
  }

  // Riepilogo finale
  console.log('\n' + '='.repeat(50));
  console.log('COMPLETATO!');
  console.log('='.repeat(50));

  console.log('\n📄 Pagine sincronizzate: ' + localPages.rows.length);

  console.log('\n👤 CREDENZIALI UTENTI:');
  console.log('-'.repeat(50));
  users.forEach(u => {
    console.log(`   Email:    ${u.email}`);
    console.log(`   Password: ${u.password}`);
    console.log('');
  });
  console.log('='.repeat(50));
}

main().catch(console.error);
