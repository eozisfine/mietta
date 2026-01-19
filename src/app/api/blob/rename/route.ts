import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { url, newName } = await request.json();

    if (!url || !newName) {
      return NextResponse.json({ error: 'URL e nuovo nome richiesti' }, { status: 400 });
    }

    // Valida il nuovo nome (no caratteri speciali problematici)
    const sanitizedName = newName.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!sanitizedName) {
      return NextResponse.json({ error: 'Nome non valido' }, { status: 400 });
    }

    // Scarica il file originale
    const fileResponse = await fetch(url);
    if (!fileResponse.ok) {
      return NextResponse.json({ error: 'Impossibile scaricare il file originale' }, { status: 400 });
    }

    const fileBlob = await fileResponse.blob();

    // Estrai il path originale
    const originalPathname = new URL(url).pathname;
    const pathParts = originalPathname.split('/');
    pathParts.pop(); // Rimuovi il vecchio nome
    const folder = pathParts.join('/').replace(/^\//, '');

    // Mantieni l'estensione originale se non specificata nel nuovo nome
    const originalExt = originalPathname.split('.').pop()?.toLowerCase();
    const hasExtension = sanitizedName.includes('.');
    const finalName = hasExtension ? sanitizedName : `${sanitizedName}.${originalExt}`;

    // Carica con il nuovo nome
    const newBlob = await put(
      folder ? `${folder}/${finalName}` : finalName,
      fileBlob,
      {
        access: 'public',
        contentType: fileBlob.type,
      }
    );

    // Elimina il file originale
    await del(url);

    return NextResponse.json({
      success: true,
      oldUrl: url,
      newUrl: newBlob.url,
      newName: finalName,
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Errore nella rinomina' },
      { status: 500 }
    );
  }
}
