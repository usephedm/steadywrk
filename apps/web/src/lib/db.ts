import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../../../packages/db/src/schema';

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return { db: null, sql: null };
  const sql = neon(url);
  const db = drizzle(sql, { schema });
  return { db, sql };
}

const { db, sql } = createDb();
export { db, schema, sql };
