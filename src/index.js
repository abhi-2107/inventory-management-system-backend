const { serve } = require("@hono/node-server");
const { Hono } = require("hono");
const { cors } = require("hono/cors");
const { logger } = require("hono/logger");
const config = require("./config");

console.log("ENV CHECK:", {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  NODE_ENV: process.env.NODE_ENV,
});
// Bypass self-signed certificate errors in development
if (config.nodeEnv === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = new Hono();

// Global Middlewares
app.use("*", logger());
const allowedOrigins = Array.isArray(config.corsOrigin)
  ? config.corsOrigin
  : [config.corsOrigin];

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;

      if (allowedOrigins.includes(origin)) {
        return origin; // ✅ exact match required
      }

      console.log("❌ Blocked:", origin);
      return ""; // ❌ block
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// app.use(
//   "*",
//   cors({
//     origin: config.corsOrigin,
//     allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowHeaders: ["Content-Type", "Authorization"],
//     exposeHeaders: ["Content-Length"],
//     maxAge: 600,
//     credentials: true,
//   }),
// );

// Redirect / to /health for easier verification
app.get("/", (c) => {
  return c.redirect("/health");
});

// Health Check Route
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/organization", organizationRoutes);
app.route("/api/categories", categoryRoutes);
app.route("/api/products", productRoutes);
app.route("/api/inventory", inventoryRoutes);
app.route("/api/audit", auditRoutes);

// Global Error Handling
app.onError((err, c) => {
  console.error(`[ERROR]: ${err.message}`);

  const status = err.status || 500;
  return c.json(
    {
      error: err.message || "Internal Server Error",
      status,
      timestamp: new Date().toISOString(),
    },
    status,
  );
});

// 404 Not Found Handling
app.notFound((c) => {
  return c.json(
    {
      error: "Route not found",
      status: 404,
    },
    404,
  );
});

const port = config.port;
console.log(`🚀 Server is running on port ${port} in ${config.nodeEnv} mode`);

serve({
  fetch: app.fetch,
  port,
});
