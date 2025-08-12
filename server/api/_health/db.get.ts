import { useDb } from "@/server/utils/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async () => {
  const db = useDb();
  // simple round-trip: get server time + 1=1
  const res = await db.execute(sql`select now() as now, 1 as ok`);
  // normalize output for easy reading
  const row = Array.isArray(res) ? (res as any)[0] : (res as any).rows?.[0];
  return {
    ok: true,
    now: row?.now ?? null,
  };
});
