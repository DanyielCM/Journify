import Link from 'next/link';
import { redirect } from 'next/navigation';
import { addQuestion } from '@/services/adminQuestions.service';

export const metadata = { title: 'Create Question' };

// Controller (POST)
async function createQuestionAction(formData) {
  'use server';
  try {
    await addQuestion({
      text: formData.get('text'),
      is_active: formData.get('is_active'),
    });
    redirect('/edit-questions');
  } catch (err) {
    throw err;
  }
}

export default function NewQuestionPage() {
  // View (GET)
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Create Question</h1>

      <form action={createQuestionAction} className='grid gap-4 max-w-xl'>
        <label className='grid gap-1'>
          <span className='text-sm'>Question</span>
          <textarea
            name='text'
            rows={3}
            required
            className='border rounded p-2'
          />
        </label>

        <label className='inline-flex items-center gap-2'>
          <input type='checkbox' name='is_active' defaultChecked />
          <span>Active</span>
        </label>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='px-4 py-2 rounded bg-black text-white'
          >
            Save
          </button>
          <Link href='/edit-questions' className='px-4 py-2 rounded border'>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
