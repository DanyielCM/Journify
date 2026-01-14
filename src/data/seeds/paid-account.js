import { PrismaClient } from '@prisma/client';
import { hashPin4 } from '../../lib/security/password.js';

const prisma = new PrismaClient();

async function main() {
  // Ensure the PAID plan exists
  await prisma.plan.upsert({
    where: { code: 'PAID' },
    update: {},
    create: {
      code: 'PAID',
      name: 'Paid',
      price: 500,
      currency: 'USD',
      billing_period: 'monthly',
      limits_json: { questions_per_day: 2 },
      features_json: { features: ['2 questions/day', 'themed journal'] },
    },
  });

  const paidPlan = await prisma.plan.findUnique({ where: { code: 'PAID' } });

  const users = [
    { email: 'paid1@example.com', name: 'paiduser1', pin: '1234' },
    { email: 'paid2@example.com', name: 'paiduser2', pin: '1234' },
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
      where: { user_id: user.id, plan_id: paidPlan.id },
    });

    if (!existing) {
      await prisma.subscription.create({
        data: {
          user_id: user.id,
          plan_id: paidPlan.id,
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
