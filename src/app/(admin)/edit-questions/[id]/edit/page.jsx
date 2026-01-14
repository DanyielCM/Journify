import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import {
  getQuestionById,
  updateQuestion,
} from '@/services/adminQuestions.service';

export const metadata = { title: 'Edit Question' };

// --- Controller (POST) ---
async function updateQuestionAction(formData) {
  'use server';
  const id = formData.get('id');
  try {
    await updateQuestion(id, {
      text: formData.get('text'),
      is_active: formData.get('is_active'),
    });
    redirect(`/edit-questions/${id}`);
  } catch (err) {
    throw err;
  }
}

export default async function EditQuestionPage({ params }) {
  const q = await getQuestionById(params.id);
  if (!q) return notFound();

  // --- View (GET) ---
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Edit Question</h1>

      <form action={updateQuestionAction} className='grid gap-4 max-w-xl'>
        <input type='hidden' name='id' defaultValue={q.id} />

        <label className='grid gap-1'>
          <span className='text-sm'>Question</span>
          <textarea
            name='text'
            rows={3}
            defaultValue={q.text}
            required
            className='border rounded p-2'
          />
        </label>

        <div className='warning-text'>
          Warning! Unchecking this box will disable the question for users.
        </div>
        <label className='inline-flex items-center gap-2'>
          <input
            type='checkbox'
            name='is_active'
            defaultChecked={q.is_active}
          />
          <span>Active</span>
        </label>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='px-4 py-2 rounded bg-black text-white'
          >
            Save
          </button>
          <Link
            href={`/edit-questions/${q.id}`}
            className='px-4 py-2 rounded border'
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
