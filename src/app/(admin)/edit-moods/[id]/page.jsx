import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMoodById } from '@/services/mood.service';

export default async function MoodDetailsPage({ params }) {
  const mood = await getMoodById(params.id);
  if (!mood) return notFound();

  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Mood details</h1>
      <Link
        href={`/edit-moods/${mood.id}/edit`}
        className='text-blue-600 underline'
      >
        Edit
      </Link>

      <div className='grid gap-2'>
        <div>
          <b>Id:</b> {mood.id}
        </div>
        <div className='flex items-center gap-2'>
          <b>Emoji:</b>{' '}
          <img
            src={`/Moods/${mood.emoji_key}.svg`}
            alt={mood.name}
            width={32}
            height={32}
          />
        </div>
        <div>
          <b>Name:</b> {mood.name}
        </div>
        <div>
          <b>Emoji key:</b> {mood.emoji_key}
        </div>
        <div>
          <b>Active:</b> {mood.is_active ? 'Yes' : 'No'}
        </div>
      </div>

      <Link className='text-blue-600 underline' href='/edit-moods'>
        Back to list
      </Link>
    </main>
  );
}
