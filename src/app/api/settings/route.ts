import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista tutte le impostazioni
export async function GET() {
  try {
    await initDb();
    const result = await db.execute(`SELECT * FROM site_settings ORDER BY setting_key`);

    // Converti in oggetto chiave-valore
    const settings: Record<string, any> = {};
    for (const row of result.rows) {
      const key = row.setting_key as string;
      let value = row.setting_value;

      // Parse JSON se necessario
      if (row.setting_type === 'json' && value) {
        try {
          value = JSON.parse(value as string);
        } catch {}
      }

      settings[key] = value;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Errore nel recupero impostazioni' }, { status: 500 });
  }
}

// POST - Aggiorna/crea impostazioni (batch)
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { settings } = body; // { key: value, ... }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings deve essere un oggetto' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      const settingType = typeof value === 'object' ? 'json' : 'text';
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');

      await db.execute({
        sql: `INSERT INTO site_settings (setting_key, setting_value, setting_type)
              VALUES (?, ?, ?)
              ON CONFLICT(setting_key) DO UPDATE SET
                setting_value = excluded.setting_value,
                setting_type = excluded.setting_type,
                updated_at = CURRENT_TIMESTAMP`,
        args: [key, settingValue, settingType]
      });
    }

    return NextResponse.json({ message: 'Impostazioni salvate' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 });
  }
}
