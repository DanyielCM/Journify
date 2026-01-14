import {
  listQuestions as _listQuestions,
  addQuestion as _addQuestion,
  updateQuestion as _updateQuestion,
  getQuestionById as _getQuestionById,
} from '@/repositories/admin/questionsRepo';
import { cache } from './cache';

const CACHE_KEY_ACTIVE = 'admin:questions:active';
const DEFAULT_TTL = 60; // seconds

export async function listActiveQuestions({ ttl = DEFAULT_TTL } = {}) {
  const cached = cache.get(CACHE_KEY_ACTIVE);
  if (cached) return cached;
  const items = await _listQuestions();
  cache.set(CACHE_KEY_ACTIVE, items, ttl);
  return items;
}

export async function addQuestion(formInput) {
  const created = await _addQuestion(formInput);
  cache.del(CACHE_KEY_ACTIVE);
  return created;
}

export async function updateQuestion(id, formInput) {
  const updated = await _updateQuestion(id, formInput);
  cache.del(CACHE_KEY_ACTIVE);
  return updated;
}

export async function getQuestionById(id) {
  return _getQuestionById(id);
}
