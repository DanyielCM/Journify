/**
 * Client wrapper for Daily Question endpoints. Keep this thin and testable.
 */
export function createDailyQuestionClient({ fetchFn = fetch } = {}) {
  async function fetchQuestion(offset = 0) {
    const res = await fetchFn(
      `/api/daily-question?offset=${encodeURIComponent(offset)}`
    );
    if (!res.ok) throw new Error(`Failed to fetch question: ${res.status}`);
    const json = await res.json();
    // Expected shape from server: { id, text, totalQuestions }
    return {
      id: json.id,
      text: json.text,
      totalQuestions: json.totalQuestions,
    };
  }

  async function fetchAnswerForQuestion(questionId) {
    const res = await fetchFn(
      `/api/entry-answers?questionId=${encodeURIComponent(questionId)}`
    );
    if (res.status === 204) return { answerText: null };
    if (!res.ok) throw new Error(`Failed to fetch answer: ${res.status}`);
    const json = await res.json();
    return { answerText: json.answerText ?? null };
  }

  async function saveAnswer({ questionId, answerText }) {
    const res = await fetchFn('/api/entry-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, answerText }),
    });
    if (!res.ok) throw new Error(`Failed to save answer: ${res.status}`);
    const json = await res.json();
    return { ok: !!json.ok };
  }

  return Object.freeze({ fetchQuestion, fetchAnswerForQuestion, saveAnswer });
}
