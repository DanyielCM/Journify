import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(2, 'Username is required'),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});
