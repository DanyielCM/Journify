import { prisma } from '@/data/src/prismaClient';

// Validare
function normalizeQuestionForm({ text, is_active }) {
  const cleanText = (text ?? '').toString().trim();
  const cleanActive = is_active === 'on' || is_active === true;

  if (!cleanText) {
    throw new Error('Text is required');
  }

  return { text: cleanText, is_active: cleanActive };
}

// Returnează doar întrebări active
export async function listQuestions() {
  return prisma.question.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });
}

// Returnează o întrebare doar dacă este activă
export async function getQuestionById(id) {
  return prisma.question.findFirst({
    where: { id, is_active: true },
  });
}

export async function addQuestion(formInput) {
  const data = normalizeQuestionForm(formInput);
  return prisma.question.create({ data });
}

export async function updateQuestion(id, formInput) {
  const data = normalizeQuestionForm(formInput);
  return prisma.question.update({
    where: { id },
    data,
  });
}
