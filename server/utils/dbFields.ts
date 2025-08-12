import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/** A centralized list of standardized Drizzle ORM schema field definitions to prevent duplication errors */

export const createdAt = pg
  .timestamp("createdAt", { withTimezone: true, mode: "date" })
  .defaultNow();
export const updatedAt = pg
  .timestamp("updatedAt", { withTimezone: true, mode: "date" })
  .defaultNow();
export const deletedAt = pg.timestamp("deletedAt", {
  withTimezone: true,
  mode: "date",
});

// Primary key field with createId
export const id = pg
  .varchar("id", { length: 256 })
  .primaryKey()
  .$defaultFn(createId);

export const timestamps = {
  createdAt,
  updatedAt,
  deletedAt,
};
