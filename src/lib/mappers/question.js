export function toQuestionDto(q) {
  return {
    id: q.id,
    text: q.text,
    isActive: q.is_active,
    createdAt: q.created_at.toISOString(),
  };
}
