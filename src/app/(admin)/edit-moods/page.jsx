import Link from 'next/link';
import { listActiveMoodsCached } from '@/services/mood.service';

export default async function MoodsIndexPage() {
  const moods = await listActiveMoodsCached();

  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Moods</h1>
      <Link
        href='/edit-moods/new'
        className='px-3 py-2 rounded bg-black text-white'
      >
        New Mood
      </Link>

      {moods.length === 0 ? (
        <p>No moods yet.</p>
      ) : (
        <ul className='space-y-2'>
          {moods.map((m) => (
            <li key={m.id} className='border rounded p-3'>
              <div className='font-medium flex items-center gap-2'>
                <img
                  src={`/Moods/${m.emoji_key}.svg`}
                  alt={m.name}
                  width={32}
                  height={32}
                />
                <span>{m.name}</span>
              </div>
              <div className='text-sm opacity-70'>
                Active: {m.is_active ? 'Yes' : 'No'}
              </div>
              <Link
                className='text-blue-600 underline'
                href={`/edit-moods/${m.id}`}
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
