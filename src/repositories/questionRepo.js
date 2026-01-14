export function createQuestionRepository({ prisma }) {
  return {
    list() {
      return prisma.question.findMany({ orderBy: { created_at: 'desc' } });
    },
    findById(id) {
      return prisma.question.findUnique({ where: { id } });
    },
    create(data) {
      return prisma.question.create({ data });
    },
    update(id, data) {
      return prisma.question.update({ where: { id }, data });
    },
  };
}
