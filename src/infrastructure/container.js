import { createContainer, asFunction, asValue, Lifetime } from 'awilix';
import { prisma } from '@/lib/prisma';
import { createQuestionRepository } from '@/repositories/questionRepo';
import { createQuestionService } from '@/services/question.service';

export function createRequestContainer() {
  const container = createContainer();

  container.register({
    prisma: asValue(prisma),

    questionRepository: asFunction(createQuestionRepository, {
      lifetime: Lifetime.SCOPED,
      // lifetime: Lifetime.SINGLETON
      // lifetime: Lifetime.TRANSIENT
    }),

    questionService: asFunction(createQuestionService, {
      lifetime: Lifetime.SCOPED,
      // lifetime: Lifetime.SINGLETON
      // lifetime: Lifetime.TRANSIENT
    }),
  });

  return container;
}
