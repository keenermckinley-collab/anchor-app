import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. API routes that use the database will fail.");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
});

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}
