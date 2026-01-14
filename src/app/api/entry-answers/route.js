import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import {
  getAnswerForUserQuestionDate,
  upsertAnswerForUserQuestionDate,
} from '@/services/journal.service';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    if (!questionId) return NextResponse.json(null, { status: 400 });

    const cookieStore = await cookies();
    const cookie = cookieStore.get('app_session')?.value;
    const payload = cookie ? parseSessionValue(cookie) : null;
    const userId = payload?.userId;
    if (!userId) return NextResponse.json(null, { status: 401 });

    const today = startOfToday();

    const answer = await getAnswerForUserQuestionDate(
      userId,
      questionId,
      today
    );
    if (!answer) {
      return NextResponse.json(null, { status: 200 });
    }
    return NextResponse.json({
      answerId: answer.id,
      answerText: answer.answerText,
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
    const { questionId, answerText } = body || {};
    if (!questionId || !(answerText ?? '').toString().trim()) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const today = startOfToday();

    await upsertAnswerForUserQuestionDate(
      userId,
      questionId,
      answerText,
      today
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
