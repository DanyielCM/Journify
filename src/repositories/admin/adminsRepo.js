import { prisma } from '@/data/src/prismaClient';
import { verifyPin4 } from '@/lib/security/pin';

export async function getAdminByEmail(email) {
  return prisma.admin.findUnique({ where: { email } });
}

export async function verifyAdminCredentials(email, password) {
  const admin = await getAdminByEmail(email);
  if (!admin || !admin.password_hash) return { ok: false };
  const ok = await verifyPin4(password, admin.password_hash);
  return { ok, admin };
}
