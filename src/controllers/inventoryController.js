const inventoryService = require('../services/inventoryService');

class InventoryController {
  async getMovements(c) {
    try {
      const { orgId } = c.get('user');
      const productId = c.req.query('productId');
      const movements = await inventoryService.getStockMovements(orgId, productId);
      return c.json(movements);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }

  async recordMovement(c) {
    try {
      const { orgId, id: userId } = c.get('user');
      const body = await c.req.json();
      const result = await inventoryService.recordMovement(orgId, userId, body);
      return c.json(result, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }
}

module.exports = new InventoryController();
