import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "anchor-app", time: new Date().toISOString() });
}
