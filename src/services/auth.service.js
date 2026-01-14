import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from '@/repositories/userRepo';
import { hashPin4 } from '@/lib/security/password';
import { verifyPin4 } from '@/lib/security/pin';
import { registerSchema } from '@/lib/validation/auth';
import { prisma } from '@/data/src/prismaClient';

// Error mapping
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Register function
export async function registerUser(input) {
  // Validation
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(', ');
    throw new AppError(msg || 'Invalid input', 400);
  }

  const { email, username, password, timeZone } = parsed.data;

  // Uniqueness
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  // Hashing
  const password_hash = await hashPin4(password);

  // Create user and free subscription in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const created = await tx.user.create({
      data: {
        email,
        name: username,
        time_zone: timeZone,
        password_hash,
      },
    });

    // Get or create free plan
    let freePlan = await tx.plan.findUnique({
      where: { code: 'free' },
    });

    if (!freePlan) {
      // Create free plan if it doesn't exist (should be seeded, but fallback)
      freePlan = await tx.plan.create({
        data: {
          code: 'free',
          name: 'Free',
          price: 0,
          currency: 'USD',
          billing_period: 'monthly',
          limits_json: { questions_per_day: 1 },
          features_json: { features: ['1 question/day', 'basic journal'] },
        },
      });
    }

    // Create free subscription for the user
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    await tx.subscription.create({
      data: {
        user_id: created.id,
        plan_id: freePlan.id,
        status: 'active',
        current_period_start: now,
        current_period_end: oneYearFromNow,
      },
    });

    return created;
  });

  // Return safe fields
  return {
    id: result.id,
    email: result.email,
    name: result.name,
    time_zone: result.time_zone,
    created_at: result.created_at,
  };
}

// Login function
export async function loginWithUsernameAndPin({ username, pin }) {
  const u = (username || '').trim();
  if (!u) return { ok: false, status: 400, error: 'Username is required' };

  const user = await findUserByUsername(u);
  if (!user || !user.password_hash) {
    return { ok: false, status: 401, error: 'Invalid credentials' };
  }

  const ok = await verifyPin4(pin, user.password_hash);
  if (!ok) return { ok: false, status: 401, error: 'Invalid credentials' };

  return { ok: true, user };
}
