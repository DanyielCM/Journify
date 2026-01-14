import { prisma } from '@/data/src/prismaClient.js';

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { name: username },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

export async function getUserSubscriptionPlan(userId) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: 'active',
    },
    include: {
      plan: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return subscription?.plan?.code || 'free';
}

export async function getUserSubscriptionPlanInfo(userId) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: 'active',
    },
    include: {
      plan: {
        select: {
          code: true,
          limits_json: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return {
    code: subscription?.plan?.code || 'free',
    limits: subscription?.plan?.limits_json || null,
  };
}
