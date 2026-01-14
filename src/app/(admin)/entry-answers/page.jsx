import Link from 'next/link';
import { listEntryAnswersWithDetails } from '@/repositories/admin/entryAnswersRepo';

export default async function EntryAnswersIndexPage() {
  // Controller (GET Index)
  const answers = await listEntryAnswersWithDetails();

  // View
  return (
    <main className='p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Entry answers</h1>
        <Link
          href='/entry-answers/new'
          className='px-3 py-2 rounded bg-black text-white'
        >
          New answer
        </Link>
      </div>

      {answers.length === 0 ? (
        <p>No answers yet.</p>
      ) : (
        <ul className='space-y-2'>
          {answers.map((a) => (
            <li key={a.id} className='border rounded p-3'>
              <div className='font-medium'>{a.answer_text}</div>

              <div className='text-sm opacity-70'>
                Question: <i>{a.questionText}</i>
              </div>
              <div className='text-sm opacity-70'>
                Journal entry: <i>{a.entryTitle}</i>
              </div>
              <div className='text-xs opacity-60'>
                Created at: {new Date(a.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
