import type { Database } from "./types";
import { SqliteDatabase } from "./sqlite";

export * from "./types";

export async function getDb(): Promise<Database> {
  const database = new SqliteDatabase();
  await database.initialize();

  return database;
}
