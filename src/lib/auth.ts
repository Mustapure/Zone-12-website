import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'jci_default_secret_389274';

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  userType: string;
  role: string;
}

/**
 * Sign a new JWT session token
 */
export function signSessionToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verify a JWT session token
 */
export function verifySessionToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (e) {
    return null;
  }
}

/**
 * Get current authenticated user session on the server
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('jci_session')?.value;
  
  if (!token) return null;
  
  return verifySessionToken(token);
}

/**
 * Set secure HTTP-Only session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('jci_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day in seconds
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set('jci_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
}
