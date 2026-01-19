import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista redirect attivi (per middleware)
export async function GET() {
  try {
    await initDb();
    const result = await db.execute(
      `SELECT source_path, destination_path, redirect_type FROM redirects WHERE enabled = 1`
    );
    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching active redirects:', error);
    return NextResponse.json([], { status: 200 });
  }
}
