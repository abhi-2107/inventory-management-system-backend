const prisma = require('../utils/prisma');

class AuditService {
  async getLogs(orgId) {
    return await prisma.auditLog.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit for performance
    });
  }

  async createLog(orgId, userId, { action, entity, entityId, details }) {
    return await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        details,
        userId,
        organizationId: orgId
      }
    });
  }
}

module.exports = new AuditService();
