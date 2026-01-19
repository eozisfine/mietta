import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache per i redirect (in memoria, ricaricata ogni minuto)
let redirectsCache: { source_path: string; destination_path: string; redirect_type: number }[] = [];
let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minuto

async function getRedirects(baseUrl: string) {
  const now = Date.now();
  if (redirectsCache.length > 0 && now - lastFetch < CACHE_TTL) {
    return redirectsCache;
  }

  try {
    const res = await fetch(`${baseUrl}/api/redirects/active`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      redirectsCache = await res.json();
      lastFetch = now;
    }
  } catch (error) {
    console.error('Error fetching redirects:', error);
  }

  return redirectsCache;
}

async function incrementHits(baseUrl: string, sourcePath: string) {
  try {
    // Fire and forget - non aspettiamo la risposta
    fetch(`${baseUrl}/api/redirects/hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_path: sourcePath }),
    }).catch(() => {});
  } catch {
    // Ignora errori
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const baseUrl = request.nextUrl.origin;

  // Pagina login sempre accessibile
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // API auth sempre accessibili
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Applica redirect per pagine pubbliche (non admin, non API, non asset)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const redirects = await getRedirects(baseUrl);
    const redirect = redirects.find(r => r.source_path === pathname);

    if (redirect) {
      // Incrementa contatore (fire and forget)
      incrementHits(baseUrl, pathname);

      // Costruisci URL di destinazione
      const destinationUrl = redirect.destination_path.startsWith('http')
        ? redirect.destination_path
        : new URL(redirect.destination_path, baseUrl).toString();

      return NextResponse.redirect(destinationUrl, {
        status: redirect.redirect_type,
      });
    }
  }

  // Proteggi tutte le altre rotte admin
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      // Redirect a login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // La validazione effettiva della sessione avviene nelle API
    // Il middleware controlla solo la presenza del cookie
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
