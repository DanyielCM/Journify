import Link from 'next/link';
import { redirect } from 'next/navigation';
import { addMoodAndInvalidate } from '@/services/mood.service';

export const metadata = { title: 'Create Mood' };

async function createMoodAction(formData) {
  'use server';
  try {
    await addMood({
      name: formData.get('name'),
      emoji_key: formData.get('emoji_key'),
      is_active: formData.get('is_active'),
    });
    redirect('/edit-moods');
  } catch (err) {
    throw err;
  }
}

export default function NewMoodPage() {
  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Create Mood</h1>

      <form action={createMoodAction} className='grid gap-4 max-w-xl'>
        <label className='grid gap-1'>
          <span className='text-sm'>Name</span>
          <input name='name' required className='border rounded p-2' />
        </label>

        <label className='grid gap-1'>
          <span className='text-sm'>
            Emoji key (filename without extension)
          </span>
          <input name='emoji_key' required className='border rounded p-2' />
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
          <Link href='/edit-moods' className='px-4 py-2 rounded border'>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
