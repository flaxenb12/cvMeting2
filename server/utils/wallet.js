import { sql } from "drizzle-orm";
import { wallets, walletTransactions } from "@/server/db/schemas/wallets";
import { useDb } from "@/server/utils/db";

export async function ensureWallet(tx, userId) {
  await tx.insert(wallets).values({ userId }).onConflictDoNothing();
}

export async function getBalance(tx, userId) {
  const result = await tx.execute(sql`
    SELECT COALESCE(SUM(amount_cents), 0)::int AS balance
    FROM ${walletTransactions} 
    WHERE user_id = ${userId}`);

  const row = Array.isArray(result) ? result[0] : result.rows?.[0];
  return row?.balance ?? 0;
}

export async function credit(
  tx,
  {
    userId,
    amountCents,
    createdBy,
    kind = "topup",
    method = "cash",
    sourceType = "manual",
    sourceId = null,
    note = null,
  }
) {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "amountCents must be a positive integer",
    });
  }

  await ensureWallet(tx, userId);
  const [row] = await tx
    .insert(walletTransactions)
    .values({
      userId,
      amountCents,
      createdBy,
      kind,
      method,
      sourceType,
      sourceId,
      note,
    })
    .returning();

  return row;
}

export async function debit(
  tx,
  {
    userId,
    amountCents,
    createdBy,
    kind = "purchase",
    method = "cash",
    sourceType = "order",
    sourceId = null,
    note = null,
  }
) {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "amountCents must be a positive integer",
    });
  }

  await ensureWallet(tx, userId);
  // serialise per user debits
  await tx.execute(sql`
        SELECT user_id from ${wallets}
        WHERE user_id = ${userId}
        FOR UPDATE`);

  const balance = await getBalance(tx, userId);

  if (balance < amountCents)
    throw createError({
      statusCode: 422,
      statusMessage: "Insufficient balance",
    });

  const [row] = await tx
    .insert(walletTransactions)
    .values({
      userId,
      amountCents: -amountCents,
      createdBy,
      kind,
      method,
      sourceType,
      sourceId,
      note,
    })
    .returning();

  return row;
}

export async function getBalanceNow(userId) {
  const db = useDb();
  return db.transaction((tx) => getBalance(tx, userId));
}
