/**
 * Dashboard service
 * Factory that accepts repository dependencies to make unit testing easy.
 * Returns plain DTOs (no ORM instances).
 */
export function createDashboardService({
  userRepository,
  subscriptionRepository,
  moodsRepository,
  moodLogRepository,
} = {}) {
  async function getDashboardForUser(userId) {
    // Default DTO
    const defaultPlan = { code: 'free', limits: { questionsPerDay: 1 } };

    // Get moods list (map to small DTOs)
    const moodsRaw = await (moodsRepository?.listMoods?.() ?? []);
    const moods = (moodsRaw || []).map((m) => ({
      id: m.id,
      name: m.name,
      emoji_key: m.emoji_key,
    }));

    if (!userId) {
      return {
        plan: defaultPlan,
        moods,
        userMood: null,
        user: null,
      };
    }

    // If userId provided, fetch subscription & today's mood
    const [subscription, user, todayMoodLog] = await Promise.all([
      subscriptionRepository?.getSubscriptionForUser?.(userId) ?? null,
      userRepository?.findById?.(userId) ?? null,
      moodLogRepository?.getMoodLogForUserDate?.(userId, new Date()) ?? null,
    ]);

    const plan = subscription
      ? { code: subscription.code, limits: subscription.limits ?? null }
      : defaultPlan;
    const userMood = todayMoodLog
      ? {
          id: todayMoodLog.id,
          moodId: todayMoodLog.moodId,
          note: todayMoodLog.note,
        }
      : null;
    // Patch
    const moodId = todayMoodLog?.mood_id;
    const selectedMood = moodId ? moods.find((x) => x.id === moodId) : null;

    return {
      plan,
      moods,
      userMood: selectedMood,
      user: user
        ? { id: user.id, name: user.name, timezone: user.timezone }
        : null,
    };
  }

  return Object.freeze({ getDashboardForUser });
}
