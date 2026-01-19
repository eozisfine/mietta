import { db } from './db';
import { cookies } from 'next/headers';

// Hash password con Web Crypto API (no dipendenze esterne)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Genera token sessione
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Genera token reset password
export function generateResetToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Crea sessione
export async function createSession(userId: number): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 giorni

  await db.execute({
    sql: `INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`,
    args: [userId, token, expiresAt.toISOString()],
  });

  return token;
}

// Valida sessione
export async function validateSession(token: string): Promise<{ userId: number; email: string; role: string } | null> {
  const result = await db.execute({
    sql: `
      SELECT u.id, u.email, u.role, u.enabled
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now') AND u.enabled = 1
    `,
    args: [token],
  });

  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  return {
    userId: user.id as number,
    email: user.email as string,
    role: user.role as string,
  };
}

// Elimina sessione
export async function deleteSession(token: string): Promise<void> {
  await db.execute({
    sql: `DELETE FROM sessions WHERE token = ?`,
    args: [token],
  });
}

// Elimina sessioni scadute
export async function cleanupExpiredSessions(): Promise<void> {
  await db.execute(`DELETE FROM sessions WHERE expires_at < datetime('now')`);
}

// Get current user from cookies (server-side)
export async function getCurrentUser(): Promise<{ userId: number; email: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return validateSession(token);
}
