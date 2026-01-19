import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { url, action, options } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL richiesto' }, { status: 400 });
    }

    // Scarica l'immagine originale
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Impossibile scaricare immagine' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    let processedBuffer: Buffer;
    let newExtension: string;
    let contentType: string;

    // Estrai nome file originale
    const originalPathname = new URL(url).pathname;
    const originalName = originalPathname.split('/').pop() || 'image';
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

    if (action === 'convert') {
      // Conversione formato
      const format = options?.format || 'webp';
      const quality = options?.quality || 80;

      if (format === 'webp') {
        processedBuffer = await sharp(imageBuffer)
          .webp({ quality })
          .toBuffer();
        newExtension = 'webp';
        contentType = 'image/webp';
      } else if (format === 'jpg' || format === 'jpeg') {
        processedBuffer = await sharp(imageBuffer)
          .jpeg({ quality })
          .toBuffer();
        newExtension = 'jpg';
        contentType = 'image/jpeg';
      } else if (format === 'png') {
        processedBuffer = await sharp(imageBuffer)
          .png({ quality })
          .toBuffer();
        newExtension = 'png';
        contentType = 'image/png';
      } else {
        return NextResponse.json({ error: 'Formato non supportato' }, { status: 400 });
      }
    } else if (action === 'resize') {
      // Resize
      const width = options?.width;
      const height = options?.height;
      const fit = options?.fit || 'inside'; // inside, cover, contain, fill

      if (!width && !height) {
        return NextResponse.json({ error: 'Specifica larghezza o altezza' }, { status: 400 });
      }

      // Mantieni formato originale
      const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      newExtension = ext;

      let sharpInstance = sharp(imageBuffer).resize({
        width: width || undefined,
        height: height || undefined,
        fit: fit as any,
        withoutEnlargement: true,
      });

      if (ext === 'webp') {
        processedBuffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
        contentType = 'image/webp';
      } else if (ext === 'png') {
        processedBuffer = await sharpInstance.png().toBuffer();
        contentType = 'image/png';
      } else {
        processedBuffer = await sharpInstance.jpeg({ quality: 85 }).toBuffer();
        contentType = 'image/jpeg';
        newExtension = 'jpg';
      }
    } else {
      return NextResponse.json({ error: 'Azione non valida' }, { status: 400 });
    }

    // Genera nuovo nome file
    const suffix = action === 'convert' ? '' : `_${options?.width || 'auto'}x${options?.height || 'auto'}`;
    const newFilename = `${nameWithoutExt}${suffix}.${newExtension}`;

    // Estrai cartella dall'URL originale
    const pathParts = originalPathname.split('/');
    pathParts.pop(); // Rimuovi nome file
    const folder = pathParts.join('/').replace(/^\//, '');

    // Carica su Vercel Blob
    const blob = await put(
      folder ? `${folder}/${newFilename}` : newFilename,
      processedBuffer,
      {
        access: 'public',
        contentType,
      }
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: newFilename,
      size: processedBuffer.length,
      originalSize: imageBuffer.length,
      savings: Math.round((1 - processedBuffer.length / imageBuffer.length) * 100),
    });
  } catch (error) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Errore nella trasformazione' },
      { status: 500 }
    );
  }
}
