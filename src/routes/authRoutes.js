const { Hono } = require("hono");
const authController = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");
const { authSchema } = require("../utils/validationSchemas");

const authRoutes = new Hono();

authRoutes.post("/signup", validate(authSchema.signup), (c) =>
  authController.signup(c),
);
authRoutes.post("/login", validate(authSchema.login), (c) =>
  authController.login(c),
);

module.exports = authRoutes;
