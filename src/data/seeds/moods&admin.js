import { PrismaClient } from '@prisma/client';
import { hashPin4 } from '../../lib/security/pin.js';

const prisma = new PrismaClient();

async function main() {
  // Seed default moods (idempotent-ish: ignores duplicates)
  await prisma.mood.createMany({
    data: [
      { id: 1, name: 'Angry', emoji_key: 'angry', is_active: true },
      { id: 2, name: 'Calm', emoji_key: 'calm', is_active: true },
      { id: 3, name: 'Happy', emoji_key: 'happy', is_active: true },
      { id: 4, name: 'Neutral', emoji_key: 'neutral', is_active: true },
      { id: 5, name: 'Sad', emoji_key: 'sad', is_active: true },
      { id: 6, name: 'Stressed', emoji_key: 'stressed', is_active: true },
      { id: 7, name: 'Tired', emoji_key: 'tired', is_active: true },
    ],
    skipDuplicates: true,
  });

  // Seed free plan (default plan for all new users)
  // Note: Plan.id is auto-generated UUID, we use code='free' to find it
  await prisma.plan.upsert({
    where: { code: 'free' },
    update: {},
    create: {
      code: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      billing_period: 'monthly',
      limits_json: { questions_per_day: 1 },
      features_json: { features: ['1 question/day', 'basic journal'] },
    },
  });

  // Seed a default admin account (email + 4-digit PIN)
  const adminEmail = 'admin@example.com';
  const adminPin = '1234';
  const password_hash = await hashPin4(adminPin);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password_hash },
    create: {
      email: adminEmail,
      password_hash,
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
