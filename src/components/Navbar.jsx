import styles from './Navbar.module.css';
import SignDisconnect from '@/components/SignDisconnect.jsx';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { getUserSubscriptionPlan } from '@/repositories/userRepo';

export default async function Navbar() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;
  const payload = cookie ? parseSessionValue(cookie) : null;
  const userId = payload?.userId;
  const username = payload?.username || 'User';
  const planCode = userId ? await getUserSubscriptionPlan(userId) : 'free';
  const displayPlanRaw = (planCode || 'free').toLowerCase();
  const displayPlan =
    displayPlanRaw.charAt(0).toUpperCase() + displayPlanRaw.slice(1);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}></div>
      <div className={styles.navBadges}>
        <div className={styles.signPlan}>
          <div className={styles.navSignText}>{displayPlan}</div>
          <div className={styles.personalCardIcon}></div>
        </div>
        <div className={styles.signUser}>
          <div className={styles.navSignText}>{username}</div>
          <div className={styles.userIcon}></div>
        </div>
        <SignDisconnect />
      </div>
    </nav>
  );
}
