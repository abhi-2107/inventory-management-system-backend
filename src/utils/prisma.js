const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const config = require("../config");

const pool = new Pool({
  connectionString: config.databaseUrl,
  connectionTimeoutMillis: 10000, // Wait 10 seconds for a connection
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

module.exports = prisma;
