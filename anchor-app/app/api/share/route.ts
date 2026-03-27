import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth";
import { randomUUID } from "crypto";

const shareSchema = z.object({
  reportId: z.string().uuid().optional(),
  recipientEmail: z.string().email(),
  recipientRole: z.string().optional(),
  messageBody: z.string().optional(),
  parseRepliesOptIn: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = shareSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;
  let reportId = p.reportId;
  if (!reportId) {
    const reports = await query<{ id: string }>(
      `insert into reports (user_id, storage_key, sha256)
       values ($1,$2,$3)
       returning id`,
      [userId, `pending/${randomUUID()}.pdf`, null],
    );
    reportId = reports[0].id;
  }

  const rows = await query<{ id: string; created_at: string; parse_replies_opt_in: boolean }>(
    `insert into share_actions
      (user_id, report_id, recipient_email, recipient_role, message_body, parse_replies_opt_in, delivery_status)
     values ($1,$2,$3,$4,$5,$6,'queued')
     returning id, created_at, parse_replies_opt_in`,
    [userId, reportId, p.recipientEmail, p.recipientRole ?? null, p.messageBody ?? null, p.parseRepliesOptIn],
  );

  return NextResponse.json(
    {
      shareAction: rows[0],
      tracking: {
        webhookTrackingEnabled: true,
        replyParsingEnabled: !!rows[0]?.parse_replies_opt_in,
      },
    },
    { status: 201 },
  );
}
