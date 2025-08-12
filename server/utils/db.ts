import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// In dev, Nuxt/Vite can hot-reload modules. Keep a single instance around.
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _drizzle: NodePgDatabase | undefined;
}

export function useDb(): NodePgDatabase {
  if (!global._pgPool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing DATABASE_URL env var");
    }
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // tune as needed; keep total across instances under your Postgres limit
      max: 100,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  if (!global._drizzle) {
    global._drizzle = drizzle(global._pgPool);
  }
  return global._drizzle!;
}

// Optional: graceful shutdown in prod
if (process.env.NODE_ENV === "production") {
  const end = async () => {
    try {
      await global._pgPool?.end();
    } catch {}
    process.exit(0);
  };
  process.on("SIGINT", end);
  process.on("SIGTERM", end);
}
