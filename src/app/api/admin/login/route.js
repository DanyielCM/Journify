import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/repositories/admin/adminsRepo';
import { createSessionValue, cookieOptions } from '@/lib/security/session';

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { email, password } = body;
  const result = await verifyAdminCredentials(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSessionValue({
    adminId: result.admin.id,
    email: result.admin.email,
    role: 'admin',
    iat: Date.now(),
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieOptions().name, token, cookieOptions());
  return res;
}
