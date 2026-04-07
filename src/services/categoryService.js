const prisma = require('../utils/prisma');

class CategoryService {
  async getAll(orgId) {
    return await prisma.category.findMany({
      where: { organizationId: orgId },
      include: { _count: { select: { products: true } } }
    });
  }

  async create(orgId, data) {
    return await prisma.category.create({
      data: {
        ...data,
        organizationId: orgId
      }
    });
  }

  async update(id, orgId, data) {
    return await prisma.category.update({
      where: { id, organizationId: orgId },
      data
    });
  }

  async delete(id, orgId) {
    return await prisma.category.delete({
      where: { id, organizationId: orgId }
    });
  }
}

module.exports = new CategoryService();
