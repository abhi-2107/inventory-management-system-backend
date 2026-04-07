const categoryService = require("../services/categoryService");

class CategoryController {
  async getAll(c) {
    try {
      const { orgId } = c.get("user");
      const categories = await categoryService.getAll(orgId);
      return c.json(categories);
    } catch (error) {
      return c.json({ error: error.message }, 500);
    }
  }

  async create(c) {
    try {
      const { orgId } = c.get("user");
      const body = await c.req.json();
      const category = await categoryService.create(orgId, body);
      return c.json(category, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async update(c) {
    try {
      const { orgId } = c.get("user");
      const id = c.req.param("id");
      const body = await c.req.json();
      const category = await categoryService.update(id, orgId, body);
      return c.json(category);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async delete(c) {
    try {
      const { orgId } = c.get("user");
      const id = c.req.param("id");
      await categoryService.delete(id, orgId);
      return c.json({ message: "Category deleted" });
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }
}

module.exports = new CategoryController();
