// import "./admin-globals.css";

// export default function AdminLayout({ children }) {
//   return <div className="admin-scope">{children}</div>;
// }

import './admin-globals.css';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;

  const payload = cookie ? parseSessionValue(cookie) : null;

  if (!payload || payload.role !== 'admin') {
    redirect('/admin/login');
  }

  return <div className='admin-scope'>{children}</div>;
}
