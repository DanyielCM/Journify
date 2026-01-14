import { z } from 'zod';

export const QuestionCreateSchema = z.object({
  text: z.string().min(1).max(500),
  isActive: z.boolean().optional(),
});

export const QuestionUpdateSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  isActive: z.boolean().optional(),
});
