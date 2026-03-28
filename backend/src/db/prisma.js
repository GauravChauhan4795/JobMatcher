const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set!");
  process.exit(1);
}

let prisma;

try {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
      ? [{ emit: "stdout", level: "warn" }, { emit: "stdout", level: "error" }]
      : [{ emit: "stdout", level: "error" }],
  });

  prisma.$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
    });

} catch (err) {
  console.error("Failed to initialize Prisma client:", err.message);
  process.exit(1);
}

module.exports = prisma;