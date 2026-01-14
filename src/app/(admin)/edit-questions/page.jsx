import Link from 'next/link';
import { listActiveQuestions } from '@/services/adminQuestions.service';

export default async function QuestionsIndexPage() {
  // Controller
  const questions = await listActiveQuestions();

  // View
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Questions</h1>
      <Link
        href='/edit-questions/new'
        className='px-3 py-2 rounded bg-black text-white'
      >
        New Question
      </Link>

      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul className='space-y-2'>
          {questions.map((q) => (
            <li key={q.id} className='border rounded p-3'>
              <div className='font-medium'>{q.text}</div>
              <div className='text-sm opacity-70'>
                Active: {q.is_active ? 'Yes' : 'No'}
              </div>
              <Link
                className='text-blue-600 underline'
                href={`/edit-questions/${q.id}`}
              >
                Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
