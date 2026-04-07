const organizationService = require('../services/organizationService');

class OrganizationController {
  async getDetails(c) {
    try {
      const { orgId } = c.get('user');
      const details = await organizationService.getOrganizationDetails(orgId);
      return c.json(details);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }

  async getMembers(c) {
    try {
      const { orgId } = c.get('user');
      const members = await organizationService.getMembers(orgId);
      return c.json(members);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }

  async addMember(c) {
    try {
      const { orgId, role: requesterRole } = c.get('user');
      if (requesterRole !== 'ADMIN') {
        return c.json({ error: 'Only admins can add members' }, 403);
      }
      const body = await c.req.json();
      const member = await organizationService.addMember(orgId, body);
      return c.json(member, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async revokeMember(c) {
    try {
      const { orgId, role: requesterRole } = c.get('user');
      if (requesterRole !== 'ADMIN') {
        return c.json({ error: 'Only admins can revoke members' }, 403);
      }
      const memberId = c.req.param('id');
      await organizationService.revokeMember(orgId, memberId);
      return c.json({ message: 'Member revoked successfully' });
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }
}

module.exports = new OrganizationController();
