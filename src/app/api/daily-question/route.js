import { NextResponse } from 'next/server';
import { listActiveQuestions } from '@/services/adminQuestions.service';

function dateIndex(dateString, length) {
  // deterministic: sum char codes of date string mod length
  let s = 0;
  for (let i = 0; i < dateString.length; i++) s += dateString.charCodeAt(i);
  return s % length;
}

export async function GET(req) {
  const questions = await listActiveQuestions();
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'No active questions' }, { status: 404 });
  }

  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10) || 0;

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const baseIdx = dateIndex(dateStr, questions.length);
  // allow offset navigation
  const idx =
    (((baseIdx + offset) % questions.length) + questions.length) %
    questions.length;
  const q = questions[idx];

  return NextResponse.json({
    id: q.id,
    text: q.text,
    index: idx,
    totalQuestions: questions.length,
  });
}
