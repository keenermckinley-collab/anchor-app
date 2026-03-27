import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { verifySharedSecret } from "@/lib/security";

const eventSchema = z.object({
  shareActionId: z.string().uuid(),
  provider: z.string().min(1),
  eventType: z.enum(["sent", "delivered", "opened", "bounced", "failed"]),
  payload: z.record(z.any()).optional(),
  occurredAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-anchor-webhook-secret");
  const valid = verifySharedSecret(process.env.EMAIL_WEBHOOK_SECRET, signature);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = eventSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const e = parsed.data;

  await query(
    `insert into delivery_events (share_action_id, provider, event_type, event_payload, occurred_at)
     values ($1,$2,$3,$4,$5)`,
    [e.shareActionId, e.provider, e.eventType, e.payload ?? {}, e.occurredAt ?? new Date().toISOString()],
  );

  await query(
    `update share_actions
     set delivery_status = $2, updated_at = now()
     where id = $1`,
    [e.shareActionId, e.eventType],
  );

  return NextResponse.json({ ok: true });
}
