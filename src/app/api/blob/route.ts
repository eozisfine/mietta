import { list, put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// GET - Lista tutti i blob (con supporto per prefix/cartelle)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get('prefix') || '';
    const cursor = searchParams.get('cursor') || undefined;

    const response = await list({
      prefix,
      cursor,
      limit: 100,
    });

    // Organizza i risultati in cartelle e file
    const folders = new Set<string>();
    const files: typeof response.blobs = [];

    for (const blob of response.blobs) {
      const relativePath = prefix ? blob.pathname.slice(prefix.length) : blob.pathname;
      const parts = relativePath.split('/').filter(Boolean);

      if (parts.length > 1) {
        // È in una sottocartella
        folders.add(parts[0]);
      } else if (parts.length === 1) {
        // È un file diretto
        files.push(blob);
      }
    }

    return NextResponse.json({
      blobs: files,
      folders: Array.from(folders).sort(),
      cursor: response.cursor,
      hasMore: response.hasMore,
      prefix,
    });
  } catch (error) {
    console.error('Error listing blobs:', error);
    return NextResponse.json(
      { error: 'Errore nel caricamento dei file' },
      { status: 500 }
    );
  }
}

// POST - Upload di un file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || '';

    if (!file) {
      return NextResponse.json(
        { error: 'Nessun file fornito' },
        { status: 400 }
      );
    }

    // Costruisci il pathname con la cartella
    const pathname = folder ? `${folder}/${file.name}` : file.name;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading blob:', error);
    return NextResponse.json(
      { error: 'Errore nel caricamento del file' },
      { status: 500 }
    );
  }
}

// DELETE - Elimina un blob
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL non fornito' },
        { status: 400 }
      );
    }

    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blob:', error);
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del file' },
      { status: 500 }
    );
  }
}
