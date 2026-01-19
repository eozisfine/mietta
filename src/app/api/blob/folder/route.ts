import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// POST - Crea una nuova cartella (caricando un file placeholder)
export async function POST(request: NextRequest) {
  try {
    const { folderPath } = await request.json();

    if (!folderPath) {
      return NextResponse.json(
        { error: 'Path cartella non fornito' },
        { status: 400 }
      );
    }

    // Vercel Blob non ha cartelle vere, ma possiamo creare un file placeholder
    // per simulare la struttura
    const placeholderPath = `${folderPath}/.folder`;
    const placeholderContent = new Blob([''], { type: 'text/plain' });

    const blob = await put(placeholderPath, placeholderContent, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, folder: folderPath, blob });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione della cartella' },
      { status: 500 }
    );
  }
}
