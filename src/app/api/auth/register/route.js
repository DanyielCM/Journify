import { NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.service';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const user = await registerUser(body);

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    const status = err?.status ?? 500;

    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Internal server error' },
      { status }
    );
  }
}
