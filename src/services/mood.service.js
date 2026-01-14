/*
 * Mood service
 * Factory with injected repositories for testability.
 */
import { cache } from './cache';

const CACHE_KEY_ACTIVE_MOODS = 'moods:active';
const DEFAULT_TTL = 300; // 5 minutes

export function createMoodService({ moodsRepository, moodLogRepository } = {}) {
  async function listActiveMoods() {
    const cached = cache.get(CACHE_KEY_ACTIVE_MOODS);
    if (cached) return cached;
    const raw = (await moodsRepository?.listMoods?.()) ?? [];
    const result = (raw || []).map((m) => ({
      id: m.id,
      name: m.name,
      emoji_key: m.emoji_key,
    }));
    cache.set(CACHE_KEY_ACTIVE_MOODS, result, DEFAULT_TTL);
    return result;
  }

  async function getTodayMoodForUser(userId) {
    if (!userId) return null;
    const log = await moodLogRepository?.getMoodLogForUserDate?.(
      userId,
      new Date()
    );
    return log ? { id: log.id, moodId: log.moodId, note: log.note } : null;
  }

  // Invalidate cache when admin modifies mood list
  async function addMood(formInput) {
    const created = await moodsRepository?.addMood?.(formInput);
    cache.del(CACHE_KEY_ACTIVE_MOODS);
    return created;
  }

  async function updateMood(id, formInput) {
    const updated = await moodsRepository?.updateMood?.(id, formInput);
    cache.del(CACHE_KEY_ACTIVE_MOODS);
    return updated;
  }

  async function addMoodLog({ userId, moodId, note }) {
    if (!userId || !moodId) throw new Error('userId and moodId are required');
    const created = await moodLogRepository?.addMoodLog?.({
      userId,
      moodId,
      note,
    });
    return { id: created.id, moodId: created.moodId, note: created.note };
  }

  return Object.freeze({
    listActiveMoods,
    getTodayMoodForUser,
    addMoodLog,
    addMood,
    updateMood,
  });
}

// Convenience default service using the admin repo directly
import {
  listMoods as _listMoods,
  addMood as _addMood,
  updateMood as _updateMood,
  getMoodById as _getMoodById,
} from '@/repositories/admin/moodsRepo';

const _default = createMoodService({
  moodsRepository: {
    listMoods: _listMoods,
    addMood: _addMood,
    updateMood: _updateMood,
    getMoodById: _getMoodById,
  },
  moodLogRepository: {},
});

export const listActiveMoodsCached = (...args) =>
  _default.listActiveMoods(...args);
export const addMoodAndInvalidate = (...args) => _default.addMood(...args);
export const updateMoodAndInvalidate = (...args) =>
  _default.updateMood(...args);
export const getMoodById = (...args) => _getMoodById(...args);
