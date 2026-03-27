import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { verifySharedSecret } from "@/lib/security";

const replySchema = z.object({
  shareActionId: z.string().uuid(),
  provider: z.string().min(1),
  subject: z.string().optional(),
  bodyText: z.string().optional(),
  occurredAt: z.string().datetime().optional(),
});

function likelyReceipt(subject?: string, bodyText?: string): boolean {
  const text = `${subject ?? ""} ${bodyText ?? ""}`.toLowerCase();
  return ["received", "receipt", "acknowledge", "confirmed", "reviewed"].some((w) => text.includes(w));
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-anchor-reply-secret");
  const valid = verifySharedSecret(process.env.REPLY_WEBHOOK_SECRET, signature);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = replySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const r = parsed.data;

  const shares = await query<{ parse_replies_opt_in: boolean }>(
    `select parse_replies_opt_in from share_actions where id = $1`,
    [r.shareActionId],
  );

  if (!shares[0]?.parse_replies_opt_in) {
    return NextResponse.json({ ok: true, skipped: "reply parsing not enabled" });
  }

  const receiptDetected = likelyReceipt(r.subject, r.bodyText);

  await query(
    `insert into delivery_events (share_action_id, provider, event_type, event_payload, occurred_at)
     values ($1,$2,'reply_received',$3,$4)`,
    [
      r.shareActionId,
      r.provider,
      { subject: r.subject ?? null, bodyText: r.bodyText ?? null, receiptDetected },
      r.occurredAt ?? new Date().toISOString(),
    ],
  );

  if (receiptDetected) {
    await query(
      `update share_actions
       set receipt_confirmed_at = coalesce(receipt_confirmed_at, now()), updated_at = now()
       where id = $1`,
      [r.shareActionId],
    );
  }

  return NextResponse.json({ ok: true, receiptDetected });
}
