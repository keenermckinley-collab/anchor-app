import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUserId } from "@/lib/auth";
import { query } from "@/lib/db";

const schema = z.object({
  storageKey: z.string().min(1),
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  recordId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;

  const assets = await query<{ id: string }>(
    `insert into assets (user_id, storage_key, file_name, content_type, size_bytes, scan_status)
     values ($1,$2,$3,$4,$5,'pending')
     returning id`,
    [userId, p.storageKey, p.fileName, p.contentType, p.sizeBytes],
  );

  if (p.recordId) {
    await query(
      `insert into record_assets (record_id, asset_id)
       values ($1,$2)`,
      [p.recordId, assets[0].id],
    );
  }

  await query(
    `insert into audit_events (user_id, actor_type, action, entity_type, entity_id)
     values ($1, 'user', 'asset_uploaded', 'asset', $2)`,
    [userId, assets[0].id],
  );

  return NextResponse.json({ assetId: assets[0].id });
}
