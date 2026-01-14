import styles from './DayTag.module.css';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { findUserById } from '@/repositories/userRepo';

export default async function DayTag({
  timeZone: tzProp = null,
  username: usernameProp = null,
} = {}) {
  // If parent passed timezone/username, prefer those (presentation-only). Otherwise fall back to existing session lookup.
  if (tzProp && usernameProp) {
    // Props provided by parent; skip session reads
  } else {
    // Read session
    const cookieStore = await cookies();
    const cookie = cookieStore.get('app_session')?.value;
    const payload = cookie ? parseSessionValue(cookie) : null;
    const userId = payload?.userId;

    // Determine timezone from user record if available, otherwise fallback to server detected timezone
    if (!tzProp) {
      tzProp = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      if (userId) {
        const user = await findUserById(userId);
        if (user?.time_zone) tzProp = user.time_zone;
      }
    }
    if (!usernameProp) {
      usernameProp = payload?.username || null;
    }
  }

  const timeZone = tzProp || 'UTC';
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone,
  }).format(now);
  const dayAndMonth = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone,
  }).format(now); // e.g., "12 January"
  const dayOfMonth = `~${dayAndMonth}~`;

  return (
    <div className={styles.dayTag}>
      <div className={styles.dayOfWeek}>{weekday}</div>
      <div className={styles.dayOfMonth}>{dayOfMonth}</div>
    </div>
  );
}
