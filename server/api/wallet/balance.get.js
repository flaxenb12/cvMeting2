import { getBalance } from "~/server/utils/wallet";
import { useDb } from "@/server/utils/db";
import { auth } from "@/server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const db = useDb();

  const balanceCents = await db.transaction((tx) =>
    getBalance(tx, session.user.id)
  );
  return { balanceCents };
});
