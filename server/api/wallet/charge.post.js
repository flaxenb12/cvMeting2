import { auth } from "@/server/utils/auth";
import { useDb } from "@/server/utils/db";
import { debit, getBalance } from "@/server/utils/wallet";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const body = await readBody(event);
  const userId = body.userId || session.user.id;
  if (!Number.isInteger(body.amountCents))
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid amountCents",
    });

  const db = useDb();
  const result = await db.transaction(async (tx) => {
    await debit(tx, {
      userId,
      amountCents: body.amountCents,
      createdBy: session.user.id,
      sourceType: "order",
      sourceId: body.sourceId ?? null,
      note: body.note ?? null,
    });

    const balanceCents = await getBalance(tx, userId);
    return { balanceCents };
  });

  return result;
});
