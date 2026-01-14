import { prisma } from '@/data/src/prismaClient';

// Validate and normalize form input
function normalizeMoodForm({ name, emoji_key, is_active }) {
  const cleanName = (name ?? '').toString().trim();
  const cleanEmojiKey = (emoji_key ?? '').toString().trim();
  const cleanActive = is_active === 'on' || is_active === true;

  if (!cleanName) throw new Error('Name is required');
  if (!cleanEmojiKey) throw new Error('Emoji key is required');

  return { name: cleanName, emoji_key: cleanEmojiKey, is_active: cleanActive };
}

export async function listMoods() {
  return prisma.mood.findMany({
    where: { is_active: true },
    orderBy: { id: 'desc' },
  });
}

export async function getMoodById(id) {
  const intId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (Number.isNaN(intId)) return null;
  return prisma.mood.findFirst({
    where: { id: intId, is_active: true },
  });
}

export async function addMood(formInput) {
  const data = normalizeMoodForm(formInput);
  return prisma.mood.create({ data });
}

export async function updateMood(id, formInput) {
  const intId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (Number.isNaN(intId)) throw new Error('Invalid id');
  const data = normalizeMoodForm(formInput);
  return prisma.mood.update({ where: { id: intId }, data });
}
