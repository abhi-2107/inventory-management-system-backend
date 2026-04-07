const productService = require('../services/productService');

class ProductController {
  async getAll(c) {
    try {
      const { orgId } = c.get('user');
      const products = await productService.getAll(orgId);
      return c.json(products);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }

  async create(c) {
    try {
      const { orgId } = c.get('user');
      const body = await c.req.json();
      const product = await productService.create(orgId, body);
      return c.json(product, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async update(c) {
    try {
      const { orgId } = c.get('user');
      const id = c.req.param('id');
      const body = await c.req.json();
      const product = await productService.update(id, orgId, body);
      return c.json(product);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async delete(c) {
    try {
      const { orgId } = c.get('user');
      const id = c.req.param('id');
      await productService.delete(id, orgId);
      return c.json({ message: 'Product deleted' });
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }
}

module.exports = new ProductController();
