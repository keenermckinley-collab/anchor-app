import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await query(`update users set deleted_at = now(), updated_at = now() where id = $1`, [userId]);

  await query(
    `insert into audit_events (user_id, actor_type, action, entity_type, entity_id)
     values ($1, 'user', 'account_deletion_requested', 'user', $1)`,
    [userId],
  );

  return NextResponse.json({ ok: true, message: "Account deletion requested. Data will be removed within a reasonable timeframe." });
}
