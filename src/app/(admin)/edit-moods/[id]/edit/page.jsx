import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getMoodById, updateMoodAndInvalidate } from '@/services/mood.service';

export const metadata = { title: 'Edit Mood' };

async function updateMoodAction(formData) {
  'use server';
  const id = formData.get('id');
  try {
    await updateMoodAndInvalidate(id, {
      name: formData.get('name'),
      emoji_key: formData.get('emoji_key'),
      is_active: formData.get('is_active'),
    });
    redirect(`/edit-moods/${id}`);
  } catch (err) {
    throw err;
  }
}

export default async function EditMoodPage({ params }) {
  const m = await getMoodById(params.id);
  if (!m) return notFound();

  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Edit Mood</h1>

      <form action={updateMoodAction} className='grid gap-4 max-w-xl'>
        <input type='hidden' name='id' defaultValue={m.id} />

        <label className='grid gap-1'>
          <span className='text-sm'>Name</span>
          <input
            name='name'
            defaultValue={m.name}
            required
            className='border rounded p-2'
          />
        </label>

        <label className='grid gap-1'>
          <span className='text-sm'>
            Emoji key (filename without extension)
          </span>
          <input
            name='emoji_key'
            defaultValue={m.emoji_key}
            required
            className='border rounded p-2'
          />
        </label>

        <div className='warning-text'>
          Warning! Unchecking this box will disable the mood for users.
        </div>
        <label className='inline-flex items-center gap-2'>
          <input
            type='checkbox'
            name='is_active'
            defaultChecked={m.is_active}
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
            href={`/edit-moods/${m.id}`}
            className='px-4 py-2 rounded border'
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
