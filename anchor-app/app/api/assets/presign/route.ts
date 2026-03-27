import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUserId } from "@/lib/auth";
import { buildStorageKey, createUploadUrl } from "@/lib/s3";

const schema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(50 * 1024 * 1024),
});

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { fileName, contentType } = parsed.data;
  const storageKey = buildStorageKey(userId, fileName);
  const uploadUrl = await createUploadUrl(storageKey, contentType);

  return NextResponse.json({ uploadUrl, storageKey });
}
