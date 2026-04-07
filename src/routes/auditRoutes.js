const { Hono } = require('hono');
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');

const auditRoutes = new Hono();

auditRoutes.use('*', authMiddleware);

auditRoutes.get('/', (c) => auditController.getLogs(c));

module.exports = auditRoutes;
