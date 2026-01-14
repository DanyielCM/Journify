import { prisma } from '@/data/src/prismaClient';

// View-model: EntryAnswer + Question + JournalEntry
function toEntryAnswerViewModel(row) {
  return {
    id: row.id,
    answer_text: row.answer_text,
    created_at: row.created_at,

    entryId: row.entry_id,
    entryTitle: row.entry?.title ?? '(no title)',

    questionId: row.question_id,
    questionText: row.question?.text ?? '(no question)',
  };
}

// pentru Index: listă cu detalii
export async function listEntryAnswersWithDetails() {
  const rows = await prisma.entryAnswer.findMany({
    include: {
      question: true,
      entry: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return rows.map(toEntryAnswerViewModel);
}

// pentru dropdown Questions
export async function listQuestionsForSelect() {
  return prisma.question.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
    select: { id: true, text: true },
  });
}

// pentru dropdown Entries
export async function listEntriesForSelect() {
  return prisma.journalEntry.findMany({
    orderBy: { created_at: 'desc' },
    select: { id: true, title: true },
  });
}

// Create
export async function addEntryAnswer({ entry_id, question_id, answer_text }) {
  const cleanAnswer = (answer_text ?? '').toString().trim();
  const cleanEntryId = (entry_id ?? '').toString().trim();
  const cleanQuestionId = (question_id ?? '').toString().trim();

  if (!cleanAnswer) throw new Error('Answer text is required');
  if (!cleanEntryId) throw new Error('Entry is required');
  if (!cleanQuestionId) throw new Error('Question is required');

  return prisma.entryAnswer.create({
    data: {
      entry_id: cleanEntryId,
      question_id: cleanQuestionId,
      answer_text: cleanAnswer,
    },
  });
}
