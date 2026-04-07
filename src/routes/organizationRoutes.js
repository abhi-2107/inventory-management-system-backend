const { Hono } = require('hono');
const organizationController = require('../controllers/organizationController');
const authMiddleware = require('../middleware/authMiddleware');

const organizationRoutes = new Hono();

organizationRoutes.use('*', authMiddleware);

organizationRoutes.get('/details', (c) => organizationController.getDetails(c));
organizationRoutes.get('/members', (c) => organizationController.getMembers(c));
organizationRoutes.post('/members', (c) => organizationController.addMember(c));
organizationRoutes.delete('/members/:id', (c) => organizationController.revokeMember(c));

module.exports = organizationRoutes;
