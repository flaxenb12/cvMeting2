import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schemas",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
