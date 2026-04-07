const { Hono } = require('hono');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const categoryRoutes = new Hono();

categoryRoutes.use('*', authMiddleware);

categoryRoutes.get('/', (c) => categoryController.getAll(c));
categoryRoutes.post('/', (c) => categoryController.create(c));
categoryRoutes.put('/:id', (c) => categoryController.update(c));
categoryRoutes.delete('/:id', (c) => categoryController.delete(c));

module.exports = categoryRoutes;
