import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { prisma } from '@/data/src/prismaClient';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('app_session')?.value;
    const payload = cookie ? parseSessionValue(cookie) : null;
    const userId = payload?.userId;
    if (!userId) return NextResponse.json(null, { status: 401 });

    const today = startOfToday();

    const entry = await prisma.journalEntry.findFirst({
      where: { user_id: userId, entry_date: today },
    });

    if (!entry) return NextResponse.json(null, { status: 204 });

    return NextResponse.json({
      id: entry.id,
      title: entry.title,
      body: entry.body,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('app_session')?.value;
    const payload = cookie ? parseSessionValue(cookie) : null;
    const userId = payload?.userId;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const title = (body?.title ?? '').toString().trim();
    const content = (body?.body ?? '').toString().trim();

    if (!title && !content)
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const today = startOfToday();

    let entry = await prisma.journalEntry.findFirst({
      where: { user_id: userId, entry_date: today },
    });

    if (!entry) {
      entry = await prisma.journalEntry.create({
        data: {
          user_id: userId,
          entry_date: today,
          title: title || `Journal - ${today.toISOString().split('T')[0]}`,
          body: content || '',
        },
      });
    } else {
      entry = await prisma.journalEntry.update({
        where: { id: entry.id },
        data: { title: title || entry.title, body: content || entry.body },
      });
    }

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
