import { createHash, timingSafeEqual } from "crypto";

export function verifySharedSecret(secret: string | undefined, provided: string | null): boolean {
  if (!secret || !provided) return false;
  const expected = createHash("sha256").update(secret).digest();
  const received = createHash("sha256").update(provided).digest();
  return timingSafeEqual(expected, received);
}
