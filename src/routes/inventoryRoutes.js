const { Hono } = require('hono');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

const inventoryRoutes = new Hono();

inventoryRoutes.use('*', authMiddleware);

inventoryRoutes.get('/movements', (c) => inventoryController.getMovements(c));
inventoryRoutes.post('/movements', (c) => inventoryController.recordMovement(c));

module.exports = inventoryRoutes;
