const auditService = require('../services/auditService');

class AuditController {
  async getLogs(c) {
    try {
      const { orgId, role } = c.get('user');
      if (role !== 'ADMIN') {
        return c.json({ error: 'Only admins can view audit logs' }, 403);
      }
      const logs = await auditService.getLogs(orgId);
      return c.json(logs);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }
}

module.exports = new AuditController();
