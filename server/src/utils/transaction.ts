import { PoolClient } from "pg";
import dbPool from "../db";

export const withTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");
    const results = await callback(client);
    await client.query("COMMIT");

    return results;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
