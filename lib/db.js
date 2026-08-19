import { neon } from '@neondatabase/serverless';

let client;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!client) client = neon(url, { fullResults: false });
  return client;
}
