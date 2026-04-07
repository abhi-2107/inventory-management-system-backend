const prisma = require('../utils/prisma');

class ProductService {
  async getAll(orgId) {
    return await prisma.product.findMany({
      where: { organizationId: orgId },
      include: { category: true }
    });
  }

  async create(orgId, data) {
    return await prisma.product.create({
      data: {
        ...data,
        organizationId: orgId
      }
    });
  }

  async update(id, orgId, data) {
    return await prisma.product.update({
      where: { id, organizationId: orgId },
      data
    });
  }

  async delete(id, orgId) {
    return await prisma.product.delete({
      where: { id, organizationId: orgId }
    });
  }
}

module.exports = new ProductService();
