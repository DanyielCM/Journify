import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/login';
import { loginWithUsernameAndPin } from '@/services/auth.service';
import { createSessionValue, cookieOptions } from '@/lib/security/session';

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { username, pin } = parsed.data;

  const result = await loginWithUsernameAndPin({ username, pin });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  const token = createSessionValue({
    userId: result.user.id,
    username: result.user.name,
    iat: Date.now(),
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieOptions().name, token, cookieOptions());
  return res;
}
