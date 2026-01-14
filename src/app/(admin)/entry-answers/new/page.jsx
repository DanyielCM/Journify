import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  addEntryAnswer,
  listEntriesForSelect,
  listQuestionsForSelect,
} from '@/repositories/admin/entryAnswersRepo';

// Controller (POST)
async function createEntryAnswerAction(formData) {
  'use server';

  try {
    await addEntryAnswer({
      entry_id: formData.get('entry_id'),
      question_id: formData.get('question_id'),
      answer_text: formData.get('answer_text'),
    });

    redirect('/entry-answers');
  } catch (err) {
    console.error('Validation failed:', err.message);
    throw err;
  }
}

export default async function NewEntryAnswerPage() {
  // Controller (GET)
  const [entries, questions] = await Promise.all([
    listEntriesForSelect(),
    listQuestionsForSelect(),
  ]);

  // View
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Create entry answer</h1>

      <form action={createEntryAnswerAction} className='grid gap-4 max-w-xl'>
        {/* FK spre JournalEntry */}
        <label className='grid gap-1'>
          <span className='text-sm'>Journal entry</span>
          <select name='entry_id' required className='border rounded p-2'>
            <option value=''>Select an entry…</option>
            {entries.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </label>

        {/* FK spre Question */}
        <label className='grid gap-1'>
          <span className='text-sm'>Question</span>
          <select name='question_id' required className='border rounded p-2'>
            <option value=''>Select a question…</option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.text}
              </option>
            ))}
          </select>
        </label>

        {/* răspunsul */}
        <label className='grid gap-1'>
          <span className='text-sm'>Answer text</span>
          <textarea
            name='answer_text'
            rows={3}
            required
            minLength={5}
            className='border rounded p-2'
          />
        </label>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='px-4 py-2 rounded bg-black text-white'
          >
            Save
          </button>
          <Link href='/entry-answers' className='px-4 py-2 rounded border'>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
