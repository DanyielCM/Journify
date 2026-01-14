import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { redirect } from 'next/navigation';

export default async function UserPagesLayout({ children }) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;

  const payload = cookie ? parseSessionValue(cookie) : null;

  // Check if user is authenticated (has userId and is not an admin)
  if (!payload || !payload.userId || payload.role === 'admin') {
    redirect('/login');
  }

  return <>{children}</>;
}
