import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { query } from "@/lib/db";

type UserRow = { id: string };

async function ensureLocalUser(email: string, fullName?: string | null): Promise<string> {
  const rows = await query<UserRow>(
    `insert into users (email, full_name, auth_provider, mfa_enabled)
     values ($1, $2, 'auth0', false)
     on conflict (email)
     do update set full_name = coalesce(excluded.full_name, users.full_name), updated_at = now()
     returning id`,
    [email, fullName ?? null],
  );

  return rows[0].id;
}

export async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await getSession();
    const email = session?.user?.email;

    if (email) {
      return await ensureLocalUser(email, session?.user?.name ?? null);
    }
  } catch {
    // Fallback for local/dev flows when auth is not configured.
  }

  return req.headers.get("x-user-id");
}
