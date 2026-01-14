import { NextResponse } from 'next/server';
import { cookieOptions } from '@/lib/security/session';

export async function POST() {
  // Clear the session cookie
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieOptions().name, '', { ...cookieOptions(), maxAge: 0 });
  return res;
}
