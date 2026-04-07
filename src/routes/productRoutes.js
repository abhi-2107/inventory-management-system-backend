const { Hono } = require("hono");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const productRoutes = new Hono();

productRoutes.use("*", authMiddleware);

productRoutes.get("/", (c) => productController.getAll(c));
productRoutes.post("/", roleMiddleware(["ADMIN", "MANAGER"]), (c) =>
  productController.create(c),
);
productRoutes.put("/:id", roleMiddleware(["ADMIN", "MANAGER"]), (c) =>
  productController.update(c),
);
productRoutes.delete("/:id", roleMiddleware(["ADMIN"]), (c) =>
  productController.delete(c),
);

module.exports = productRoutes;
