import { NextResponse } from 'next/server';
import { parseSessionValue } from '@/lib/security/session';
import { cookies } from 'next/headers';
import { addMoodLog, getMoodLogForUserDate } from '@/repositories/moodRepo';
import { getUserSubscriptionPlan } from '@/repositories/userRepo';

export async function POST(req) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;
  const payload = cookie ? parseSessionValue(cookie) : null;
  const userId = payload?.userId;

  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const moodId =
    typeof body?.mood_id === 'number'
      ? body.mood_id
      : parseInt(body?.mood_id, 10);

  if (Number.isNaN(moodId)) {
    return NextResponse.json({ error: 'Invalid mood id' }, { status: 400 });
  }

  // Only paid/basic and premium users can log moods
  const plan = (
    (await getUserSubscriptionPlan(userId)) || 'free'
  ).toLowerCase();
  if (plan === 'free') {
    return NextResponse.json(
      { error: 'Subscription plan does not allow mood logging' },
      { status: 403 }
    );
  }

  // Check if user already logged today
  const existing = await getMoodLogForUserDate(userId, new Date());
  if (existing) {
    return NextResponse.json(
      { ok: true, mood: existing.mood, already: true },
      { status: 200 }
    );
  }

  try {
    const created = await addMoodLog({ userId, moodId });
    return NextResponse.json({ ok: true, mood: created.mood }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not log mood' }, { status: 500 });
  }
}
