import styles from './JournalNavigation.module.css';
import Link from 'next/link';

export default function JournalNavigation() {
  return (
    <div className={styles.journalSigns}>
      <div className={styles.journalSignsLeft}>
        <Link
          href='/dashboard'
          className={styles.signDashboard}
          aria-label='Go to dashboard'
        >
          <div className={styles.signText}>Today</div>
        </Link>
        <Link
          href='/journal'
          className={styles.signJournal}
          aria-label='Go to journal'
        >
          <div className={styles.signText}>Journal</div>
        </Link>
        <div className={styles.signQuestions}>
          <div className={styles.signText}>Questions</div>
        </div>
        <div className={styles.signMood}>
          <div className={styles.signText}>Mood</div>
          <div className={styles.signIconLock}></div>
        </div>
        <div className={styles.signGoals}>
          <div className={styles.signText}>Goals</div>
          <div className={styles.signIconLock}></div>
        </div>
      </div>
      <div className={styles.journalSignsRight}>
        <div className={styles.signSettings}>
          <div className={styles.signIconSettings}></div>
          <div className={styles.signTextSettings}>Settings</div>
        </div>
      </div>
    </div>
  );
}
