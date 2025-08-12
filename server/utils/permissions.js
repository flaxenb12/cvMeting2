import { getRequestHeaders } from "h3";
import { auth } from "@/server/utils/auth"; // your BetterAuth wrapper
import { useDb } from "@/server/utils/db";
import { eq, and, isNull } from "drizzle-orm";
import { userRoles } from "@/server/db/schemas/roles"; // TS schema ok to import

export async function requireUser(event) {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(event),
  });
  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  return session;
}

async function fetchRoles(userId) {
  const db = useDb();
  const rows = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, userId));
  return rows.map((row) => row.role);
}

export async function requireRole(event, roles) {
  const session = await requireUser(event);
  //maybe add Betterauth admin check?

  //userRoles
  const userRoleList = await fetchRoles(session.user.id);
  if (userRoleList.includes("admin")) return session;

  const ok = roles.some((role) => userRoleList.includes(role));
  if (!ok) throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  return session;
}
