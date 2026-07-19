import { Pool, type QueryResultRow } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function withTransaction<T>(
  fn: (query: <R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<R[]>) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const scopedQuery = async <R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => {
      const result = await client.query<R>(text, params);
      return result.rows;
    };
    const value = await fn(scopedQuery);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
