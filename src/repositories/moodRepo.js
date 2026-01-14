import { prisma } from '@/data/src/prismaClient.js';

// Find today's mood log for a user (using date bounds)
export async function getMoodLogForUserDate(userId, date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return prisma.moodLog.findFirst({
    where: {
      user_id: userId,
      entry_date: { gte: start, lt: end },
    },
    include: { mood: true },
  });
}

export async function addMoodLog({ userId, moodId, note = null }) {
  const entryDate = new Date();
  entryDate.setHours(0, 0, 0, 0);

  return prisma.moodLog.create({
    data: {
      user_id: userId,
      mood_id: moodId,
      entry_date: entryDate,
      note,
    },
    include: { mood: true },
  });
}
