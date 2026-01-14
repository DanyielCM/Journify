import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuestionById } from '@/services/adminQuestions.service';

export default async function QuestionDetailsPage({ params }) {
  // Controller

  const question = await getQuestionById(params.id);
  if (!question) return notFound();
  // View

  return (
    <main className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Question details</h1>
      <Link
        href={`/edit-questions/${question.id}/edit`}
        className='text-blue-600 underline'
      >
        Edit
      </Link>

      <div className='grid gap-2'>
        <div>
          <b>Id:</b> {question.id}
        </div>
        <div>
          <b>Text:</b> {question.text}
        </div>
        <div>
          <b>Active:</b> {question.is_active ? 'Yes' : 'No'}
        </div>
        <div>
          <b>Created:</b> {new Date(question.created_at).toISOString()}
        </div>
      </div>
      <Link className='text-blue-600 underline' href='/edit-questions'>
        Back to list
      </Link>
    </main>
  );
}
