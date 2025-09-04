import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  index,
  check,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

// small table to lock when UPDATE
export const wallets = pgTable("wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Balance movemements !enums give error, something to investigate
// const walletKind = pgEnum("kind", [
//   "topup",
//   "purchase",
//   "refund",
//   "adjustment",
// ]);

// const walletMethod = pgEnum("method", [
//   "cash",
//   "summit",
//   "banktransfer",
//   "payconic",
// ]);

export const walletTransactions = pgTable(
  "wallet_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    kind: text("kind").notNull(), // topup, purchase, refund, adjustment
    method: text("method").notNull(), // cash, summit, banktransfer, payconic
    sourceType: text("source_type"), // order, manual, null
    sourceId: uuid("source_id"),
    note: text("note"),
    amountCents: integer("amount_cents").notNull(),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    byUser: index("idx_wallet_tx_user").on(table.userId),
    bySource: index("idx_wallet_tx_source").on(
      table.sourceType,
      table.sourceId
    ),
    // nonzero on amountCents,
    nonZeroAmount: check(
      "chk_wallet_tx_nonzero",
      sql`${table.amountCents} <> 0`
    ),
  })
);
