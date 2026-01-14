import { NextResponse } from 'next/server';
import { createRequestContainer } from '@/infrastructure/container';
import { QuestionCreateSchema } from '@/lib/validation/question';

export async function GET() {
  const container = createRequestContainer();
  const service = container.resolve('questionService');

  const data = await service.getAll();
  return NextResponse.json(data);
}

export async function POST(req) {
  const container = createRequestContainer();
  const service = container.resolve('questionService');

  const json = await req.json().catch(() => null);
  const parsed = QuestionCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await service.create({
    text: parsed.data.text,
    isActive: parsed.data.isActive,
  });

  return NextResponse.json(created, { status: 201 });
}
