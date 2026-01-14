import styles from './page.module.css';
import Navbar from '@/components/Navbar.jsx';
import JournalNavigation from '@/components/JournalNavigation.jsx';
import DayTag from '@/components/DayTag';
import JournalEditorClient from '@/components/JournalEditor.client.jsx';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import { getUserSubscriptionPlan } from '@/repositories/userRepo';

export default async function Journal() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;
  const payload = cookie ? parseSessionValue(cookie) : null;
  const userId = payload?.userId;
  const planCode = userId ? await getUserSubscriptionPlan(userId) : 'free';
  const username = payload?.username || 'User';

  return (
    <div className={styles.journalPage}>
      <Navbar />

      <div className={styles.journal}>
        <div className={styles.leftSide}>
          <div className={styles.topSection}>
            <DayTag />

            <div className={styles.journalTitle} id='journal-title-slot' />
          </div>

          <div className={styles.leftSidePage} id='journal-body-slot' />
        </div>

        <div className={styles.rightSide}>
          <div className={styles.rightSidePage} id='journal-button-slot' />
        </div>

        {/* Client editor mounts inputs/buttons into the slots above */}
        <JournalEditorClient />
      </div>

      <JournalNavigation />
    </div>
  );
}
