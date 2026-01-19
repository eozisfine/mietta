import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista backup e crea export
export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Se action=export, esporta tutto il database
    if (action === 'export') {
      const tables = ['pages', 'page_sections', 'page_history', 'menu_items', 'site_settings', 'contact_messages', 'redirects'];
      const backup: Record<string, any[]> = {};

      for (const table of tables) {
        try {
          const result = await db.execute(`SELECT * FROM ${table}`);
          backup[table] = result.rows as any[];
        } catch {
          backup[table] = [];
        }
      }

      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        tables: backup
      };

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

    // Altrimenti lista backup salvati
    const result = await db.execute(`SELECT * FROM backups ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error with backup:', error);
    return NextResponse.json({ error: 'Errore backup' }, { status: 500 });
  }
}

// POST - Importa backup
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { action, data } = body;

    if (action === 'import' && data) {
      const { tables } = data;

      if (!tables || typeof tables !== 'object') {
        return NextResponse.json({ error: 'Formato backup non valido' }, { status: 400 });
      }

      const imported: string[] = [];
      const errors: string[] = [];

      // Importa ogni tabella
      for (const [tableName, rows] of Object.entries(tables)) {
        if (!Array.isArray(rows) || rows.length === 0) continue;

        try {
          // Cancella dati esistenti (opzionale, basato su flag)
          if (body.overwrite) {
            await db.execute(`DELETE FROM ${tableName}`);
          }

          // Inserisci nuovi dati
          for (const row of rows) {
            const columns = Object.keys(row).filter(k => k !== 'id');
            const values = columns.map(c => row[c]);
            const placeholders = columns.map(() => '?').join(', ');

            await db.execute({
              sql: `INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
              args: values
            });
          }

          imported.push(`${tableName}: ${rows.length} righe`);
        } catch (err) {
          errors.push(`${tableName}: ${(err as Error).message}`);
        }
      }

      return NextResponse.json({
        message: 'Import completato',
        imported,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    return NextResponse.json({ error: 'Azione non valida' }, { status: 400 });
  } catch (error) {
    console.error('Error importing backup:', error);
    return NextResponse.json({ error: 'Errore import' }, { status: 500 });
  }
}
