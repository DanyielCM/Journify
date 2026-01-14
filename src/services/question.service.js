import { toQuestionDto } from '@/lib/mappers/question';

export function createQuestionService({ questionRepository }) {
  return {
    async getAll() {
      const items = await questionRepository.list();
      return items.map(toQuestionDto);
    },

    async getById(id) {
      const item = await questionRepository.findById(id);
      return item ? toQuestionDto(item) : null;
    },

    async create({ text, isActive }) {
      const created = await questionRepository.create({
        text,
        is_active: isActive ?? true,
      });
      return toQuestionDto(created);
    },

    async update(id, { text, isActive }) {
      const updated = await questionRepository.update(id, {
        ...(text !== undefined ? { text } : {}),
        ...(isActive !== undefined ? { is_active: isActive } : {}),
      });
      return toQuestionDto(updated);
    },
  };
}
