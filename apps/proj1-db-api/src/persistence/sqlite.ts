import { Database as Sqlite3Database } from "sqlite3";
import type { Database as SqliteDatabaseType } from "sqlite";
import { open } from "sqlite";
import type { Column, Database, Table } from "./types";

async function getDb(): Promise<SqliteDatabaseType> {
  return open({
    filename: "./database.local.db",
    driver: Sqlite3Database,
  });
}

export class SqliteDatabase implements Database {
  private db: SqliteDatabaseType | undefined;

  public async initialize(): Promise<void> {
    this.db = await getDb();
    console.debug(
      `[DATABASE] Database initialized at "${this.db.config.filename}"`
    );
  }

  public async createTable(name: string, columns: Column[]): Promise<Table> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    const columnDefs = columns
      .map((column) => {
        const type = column.type ?? "TEXT";
        const nullable = column.nullable ? "" : "NOT NULL";
        const primaryKey = column.primaryKey ? "PRIMARY KEY AUTOINCREMENT" : "";
        const unique = column.unique ? "UNIQUE" : "";
        return `${column.name} ${type} ${nullable} ${primaryKey} ${unique}`;
      })
      .join(", ");
    const sql = `CREATE TABLE IF NOT EXISTS ${name} (${columnDefs})`;
    console.debug(`[DATABASE] ${sql}`);
    await this.db.exec(sql);

    return { name, columns };
  }

  public async select(
    columns: string[],
    from: string,
    where: string
  ): Promise<unknown[]> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    const sql = `SELECT ${columns.join(", ")} FROM ${from} WHERE ${where}`;
    console.debug(`[DATABASE] ${sql}`);
    const rows: unknown[] = await this.db.all(sql);

    return rows;
  }

  public async insert(table: string, values: object): Promise<number> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    const columns = Object.keys(values);
    const placeholders = columns.map((column) => `$${column}`).join(", ");
    const sql = `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;
    console.debug(`[DATABASE] ${sql}`);
    const result = await this.db.run(
      sql,
      this.mapValuesWithPlaceholderPrefix(values)
    );

    if (result.lastID === undefined) {
      throw new Error("[DATABASE] Failed to insert row(s)");
    }

    return result.lastID;
  }

  private mapValuesWithPlaceholderPrefix(
    values: object
  ): Record<string, unknown> {
    const mappedValues: Record<string, unknown> = {};
    Object.entries(values).forEach(([column, value]) => {
      const mappedName = `$${column}`;
      mappedValues[mappedName] = value;
    });
    return mappedValues;
  }

  public async update(
    table: string,
    values: object,
    where: string
  ): Promise<number> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    const assignments = Object.keys(values)
      .map((column) => `${column} = $${column}`)
      .join(", ");
    const sql = `UPDATE ${table} SET ${assignments} WHERE ${where}`;
    console.debug(`[DATABASE] ${sql}`);
    const result = await this.db.run(
      sql,
      this.mapValuesWithPlaceholderPrefix(values)
    );

    if (result.changes === undefined) {
      throw new Error("[DATABASE] Failed to update row(s)");
    }

    return result.changes;
  }

  public async delete(table: string, where: string): Promise<number> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    const sql = `DELETE FROM ${table} WHERE ${where}`;
    console.debug(`[DATABASE] ${sql}`);
    const result = await this.db.run(sql);

    if (result.changes === undefined) {
      throw new Error("[DATABASE] Failed to delete row(s)");
    }

    return result.changes;
  }

  public async close(): Promise<void> {
    if (!this.db) {
      throw new Error("[DATABASE] Database not initialized");
    }

    console.debug(`[DATABASE] Closing database connection`);
    await this.db.close();
  }
}
