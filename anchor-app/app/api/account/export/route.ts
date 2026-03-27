import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await query(`select id, email, full_name, created_at from users where id = $1`, [userId]);
  const records = await query(`select * from records where user_id = $1 order by submitted_at desc`, [userId]);
  const assets = await query(`select * from assets where user_id = $1 order by uploaded_at desc`, [userId]);
  const reports = await query(`select * from reports where user_id = $1 order by generated_at desc`, [userId]);

  return NextResponse.json({ exportedAt: new Date().toISOString(), user, records, assets, reports });
}
