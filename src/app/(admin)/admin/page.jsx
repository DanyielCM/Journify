import Link from 'next/link';

export const metadata = { title: 'Admin Home' };

export default function AdminHomePage() {
  return (
    <main className='p-6 space-y-6'>
      <header className='space-y-2'>
        <p className='text-sm uppercase tracking-wide text-neutral-500'>
          Admin
        </p>
        <h1 className='text-3xl font-semibold'>Welcome</h1>
        <p className='text-neutral-600'>
          Choose a section to manage content.
        </p>
      </header>

      <section className='grid gap-3 max-w-md'>
        <Link
          href='/edit-questions'
          className='block rounded border border-neutral-200 px-4 py-3 hover:bg-neutral-50 transition'
        >
          <div className='font-medium'>Edit questions</div>
          <div className='text-sm text-neutral-600'>
            Manage journaling questions.
          </div>
        </Link>

        <Link
          href='/edit-moods'
          className='block rounded border border-neutral-200 px-4 py-3 hover:bg-neutral-50 transition'
        >
          <div className='font-medium'>Edit moods</div>
          <div className='text-sm text-neutral-600'>
            Update available mood options.
          </div>
        </Link>

        <Link
          href='/entry-answers'
          className='block rounded border border-neutral-200 px-4 py-3 hover:bg-neutral-50 transition'
        >
          <div className='font-medium'>Entry answers</div>
          <div className='text-sm text-neutral-600'>
            Review or add entry answers.
          </div>
        </Link>
      </section>
    </main>
  );
}
