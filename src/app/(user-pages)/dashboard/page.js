import styles from './page.module.css';
import { cookies } from 'next/headers';
import { parseSessionValue } from '@/lib/security/session';
import {
  getUserSubscriptionPlanInfo,
  findUserById,
} from '@/repositories/userRepo';
import { listActiveMoodsCached as listMoods } from '@/services/mood.service';
import { getMoodLogForUserDate } from '@/repositories/moodRepo';
import { createDashboardService } from '@/services/dashboard.service.js';
import Moods from '@/components/Moods.jsx';
import DailyQuestion from '@/components/DailyQuestion.jsx';
import Navbar from '@/components/Navbar.jsx';
import DayTag from '@/components/DayTag.jsx';
import DailyQuestionControls from '@/components/DailyQuestionControls.jsx';
import JournalNavigation from '@/components/JournalNavigation.jsx';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('app_session')?.value;
  const payload = cookie ? parseSessionValue(cookie) : null;
  const userId = payload?.userId;

  const dashboardService = createDashboardService({
    userRepository: { findById: findUserById },
    subscriptionRepository: {
      getSubscriptionForUser: getUserSubscriptionPlanInfo,
    },
    moodsRepository: { listMoods },
    moodLogRepository: { getMoodLogForUserDate },
  });

  const ctx = await dashboardService.getDashboardForUser(userId);

  const planCode = (ctx.plan?.code || 'free').toLowerCase();
  const planLimits = ctx.plan?.limits || {};
  const questionsPerDay =
    planLimits?.max_questions_per_day || planLimits?.questionsPerDay || 1;

  const isFreePlan = planCode === 'free';
  const isPaidPlan = planCode === 'paid';
  const isPremiumPlan = planCode === 'premium';

  const moods = ctx.moods || [];
  const userMood = ctx.userMood || null;
  const username = ctx.user?.name || payload?.username || 'User';
  const timeZone = ctx.user?.timezone || payload?.timezone || 'UTC';

  // Free plan: disable entire bottomSide
  // Paid plan: disable only goals section
  // Premium plan: enable all sections

  return (
    <div className={styles.dashboardPage}>
      <Navbar />
      <div className={styles.journal}>
        <div className={styles.leftSide}></div>
        <div className={styles.rightSide}>
          <div className={styles.topSide}>
            <DayTag timeZone={timeZone} username={username} />
            <div className={styles.decoSection}>
              <div className={styles.line}></div>
              <div className={styles.questionTitle}>
                {questionsPerDay > 1 ? 'Daily Questions' : 'Daily Question'}
                {questionsPerDay > 1 ? <DailyQuestionControls /> : null}
              </div>
            </div>
          </div>
          <div className={styles.middleSide}>
            {/* Daily question + answer component (client) */}
            <DailyQuestion allowedQuestions={questionsPerDay} />
          </div>
          <div
            className={`${styles.bottomSide} ${
              isFreePlan ? styles.disabled : ''
            }`}
          >
            <div className={styles.moodsContainer}>
              <div className={styles.moodTitle}>Today&apos;s Mood</div>
              <div className={styles.moods}>
                <Moods
                  moods={moods}
                  initialSelected={userMood}
                  canChoose={!isFreePlan}
                />
              </div>
            </div>
            <div
              className={`${styles.goalsContainer} ${
                isPaidPlan ? styles.disabled : ''
              }`}
            >
              <div className={styles.goalsTitle}>Goals Progress</div>
              <div className={styles.goals}></div>
            </div>
          </div>
        </div>
      </div>
      <JournalNavigation />
    </div>
  );
}
