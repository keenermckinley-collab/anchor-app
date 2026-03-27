import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth";

const createRecordSchema = z.object({
  companyId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  employmentStatus: z.enum([
    "full_time_employee",
    "contractor",
    "customer",
    "consultant",
    "no_longer_affiliated",
  ]).optional(),
  happenedAt: z.string().datetime().optional(),
  whatHappened: z.string().min(1),
  whoWasInvolved: z.string().optional(),
  witnesses: z.string().optional(),
  whoWasTold: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await query(
    `select id, submitted_at, what_happened, who_was_involved, witnesses, who_was_told
     from records where user_id = $1 order by submitted_at desc`,
    [userId],
  );

  return NextResponse.json({ records: rows });
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createRecordSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;
  const rows = await query<{ id: string; submitted_at: string }>(
    `insert into records
      (user_id, company_id, subject_id, employment_status, happened_at, what_happened, who_was_involved, witnesses, who_was_told)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     returning id, submitted_at`,
    [
      userId,
      p.companyId ?? null,
      p.subjectId ?? null,
      p.employmentStatus ?? null,
      p.happenedAt ?? null,
      p.whatHappened,
      p.whoWasInvolved ?? null,
      p.witnesses ?? null,
      p.whoWasTold ?? null,
    ],
  );

  return NextResponse.json({ record: rows[0] }, { status: 201 });
}
