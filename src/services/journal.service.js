import { prisma } from '@/data/src/prismaClient';
import { cache } from './cache';

function isoDate(d = new Date()) {
  return d.toISOString().split('T')[0];
}

const DEFAULT_TTL = 60; // seconds

function answersCacheKey(userId, date) {
  return `journal:answers:${userId}:${isoDate(date)}`;
}

export async function getAnswerForUserQuestionDate(
  userId,
  questionId,
  date = new Date()
) {
  const key = answersCacheKey(userId, date);
  const cached = cache.get(key);
  if (cached) {
    const ans = cached[questionId];
    return ans ?? null;
  }

  // load from DB
  const entry = await prisma.journalEntry.findFirst({
    where: { user_id: userId, entry_date: new Date(isoDate(date)) },
  });
  if (!entry) return null;

  const answers = await prisma.entryAnswer.findMany({
    where: { entry_id: entry.id },
  });

  const map = {};
  answers.forEach((a) => {
    map[a.question_id] = { id: a.id, answerText: a.answer_text };
  });

  cache.set(key, map, DEFAULT_TTL);
  return map[questionId] ?? null;
}

export async function upsertAnswerForUserQuestionDate(
  userId,
  questionId,
  answerText,
  date = new Date()
) {
  const day = new Date(isoDate(date));
  // find or create entry
  let entry = await prisma.journalEntry.findFirst({
    where: { user_id: userId, entry_date: day },
  });

  if (!entry) {
    entry = await prisma.journalEntry.create({
      data: {
        user_id: userId,
        entry_date: day,
        title: `Journal - ${isoDate(date)}`,
        body: '',
      },
    });
  }

  const existing = await prisma.entryAnswer.findFirst({
    where: { entry_id: entry.id, question_id: questionId },
  });

  if (existing) {
    await prisma.entryAnswer.update({
      where: { id: existing.id },
      data: { answer_text: answerText },
    });
  } else {
    await prisma.entryAnswer.create({
      data: {
        entry_id: entry.id,
        question_id: questionId,
        answer_text: answerText,
      },
    });
  }

  // invalidate cache for this user/date
  cache.del(answersCacheKey(userId, date));

  return { ok: true };
}
