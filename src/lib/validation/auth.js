import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .max(50, 'Username too long'),
    email: z.string().email('Invalid email'),
    password: z.string().regex(/^\d{4}$/, 'Password must be exactly 4 digits'),
    passwordConfirm: z.string(),
    timeZone: z.string().min(1, 'Time zone is required'),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });
