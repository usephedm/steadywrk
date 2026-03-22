import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../../../packages/db/src/schema';

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return { db: null, sql: null };

  const sql = postgres(url, {
    prepare: false,
  });
  const db = drizzle(sql, { schema });
  return { db, sql };
}

const { db, sql } = createDb();
export { db, schema, sql };
