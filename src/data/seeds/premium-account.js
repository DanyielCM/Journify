import { PrismaClient } from '@prisma/client';
import { hashPin4 } from '../../lib/security/password.js';

const prisma = new PrismaClient();

async function main() {
  // Ensure the PREMIUM plan exists
  await prisma.plan.upsert({
    where: { code: 'PREMIUM' },
    update: {},
    create: {
      code: 'PREMIUM',
      name: 'Premium',
      price: 1200,
      currency: 'USD',
      billing_period: 'monthly',
      limits_json: { questions_per_day: 2 },
      features_json: {
        features: ['2 questions/day', 'themed journal', 'mood tracking'],
      },
    },
  });

  const premiumPlan = await prisma.plan.findUnique({
    where: { code: 'PREMIUM' },
  });

  const users = [
    { email: 'premium1@example.com', name: 'premiumuser1', pin: '1234' },
    { email: 'premium2@example.com', name: 'premiumuser2', pin: '1234' },
  ];

  const now = new Date();
  const oneYear = new Date(now);
  oneYear.setFullYear(now.getFullYear() + 1);

  for (const u of users) {
    const password_hash = await hashPin4(u.pin);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { password_hash, name: u.name },
      create: {
        email: u.email,
        name: u.name,
        password_hash,
      },
    });

    // Create subscription if missing
    const existing = await prisma.subscription.findFirst({
      where: { user_id: user.id, plan_id: premiumPlan.id },
    });

    if (!existing) {
      await prisma.subscription.create({
        data: {
          user_id: user.id,
          plan_id: premiumPlan.id,
          status: 'active',
          current_period_start: now,
          current_period_end: oneYear,
        },
      });
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
