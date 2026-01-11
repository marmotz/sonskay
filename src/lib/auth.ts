import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true },
  });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

//extract session from request headers (for tRPC context)
export async function getSessionFromHeaders(headers: Headers) {
  const cookieHeader = headers.get('cookie');
  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  const token = tokenMatch?.[1];

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true },
  });
}
