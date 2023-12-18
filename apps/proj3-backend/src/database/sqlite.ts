import fs from "node:fs";
import { Database as Sqlite3Database } from "sqlite3";
import type { Database as SqliteDatabaseType } from "sqlite";
import { open } from "sqlite";
import type {
  Column,
  ColumnType,
  Database,
  DatabaseOptions,
  Row,
  Table,
} from "types";
import { Logger } from "../utils/logger";

/**
 * The directory where the SQLite databases are stored.
 */
const DATABASE_DIRECTORY = "./databases";

interface SqliteColumn {
  cid: number;
  name: string;
  type: ColumnType;
  notnull: number;
  dflt_value: unknown;
  pk: number;
}

/**
 * Represents a SQLite database connection.
 */
export class SqliteDatabase implements Database {
  /**
   * The SQLite database instance.
   */
  private db: SqliteDatabaseType | undefined;
  /**
   * The logger used for logging messages.
   */
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger("sqlite");
  }

  /**
   * Deletes the SQLite database file.
   * @param options - The database options.
   * @returns A promise that resolves when the database file is deleted.
   */
  static async deleteDatabase(options: DatabaseOptions): Promise<void> {
    const dbName: string = options.database;

    if (!fs.existsSync(DATABASE_DIRECTORY)) {
      return;
    }

    await fs.promises.rm(`${DATABASE_DIRECTORY}/${dbName}.db`);
  }

  /**
   * Retrieves the list of available databases.
   * @returns A promise that resolves to an array of strings representing the available databases.
   */
  static async getAvailableDatabases(): Promise<string[]> {
    if (!fs.existsSync(DATABASE_DIRECTORY)) {
      return [];
    }

    const files = await fs.promises.readdir(DATABASE_DIRECTORY);

    return files.map((file) => file.replace(".db", ""));
  }

  async connect(options: DatabaseOptions): Promise<void> {
    if (this.db) {
      this.logger.error("Already connected to SQLite database");
      throw new Error("Already connected to SQLite database");
    }

    const dbName: string = options.database;

    this.logger.log(`Connecting to SQLite database ${dbName}...`);
    this.db = await open({
      filename: `${DATABASE_DIRECTORY}/${dbName}.db`,
      driver: Sqlite3Database,
    });
    this.logger.log(`Connected to SQLite database ${dbName}`);
  }

  async closeConnection(): Promise<void> {
    if (!this.db) {
      this.logger.log("No connection to SQLite database to close");
      return;
    }

    const dbName: string = this.db.config.filename.replace(".db", "");

    this.logger.log(`Closing connection to SQLite database ${dbName}...`);
    await this.db.close();
    this.db = undefined;
    this.logger.log(`Closed connection to SQLite database ${dbName}`);
  }

  isConnectedToDatabase(): boolean {
    return this.db !== undefined;
  }

  async getSchemas(): Promise<string[]> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const query = "SELECT name FROM sqlite_master WHERE type = 'table'";

    this.logger.debug(query);
    const schemas = await this.db.all<{ name: string }[]>(query);

    return schemas.map((schema) => schema.name);
  }

  async getTables(): Promise<Table[]> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const query = "SELECT name FROM sqlite_master WHERE type = 'table'";

    this.logger.debug(query);
    const tables = await this.db.all<{ name: string }[]>(query);

    return Promise.all(
      tables.map(async (table) => ({
        name: table.name,
        numColumns: (await this.getColumns(table.name)).length,
        numRows:
          (
            await this.db?.get<{ "COUNT(*)": number }>(
              `SELECT COUNT(*) FROM ${table.name}`,
            )
          )?.["COUNT(*)"] ?? 0,
      })),
    );
  }

  async createTable(name: string, columns: Column[]): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    if (columns.length === 0) {
      this.logger.error("Cannot create table with no columns");
      throw new Error("Cannot create table with no columns");
    }

    if (!columns.some((column) => column.primaryKey)) {
      this.logger.error("Cannot create table without primary key");
      throw new Error("Cannot create table without primary key");
    }

    const columnsString = columns
      .map((column) => {
        const type = column.type;
        const nullable = column.nullable ? "" : "NOT NULL";
        const primaryKey = column.primaryKey ? "PRIMARY KEY ASC" : "";
        const unique = column.unique ? "UNIQUE" : "";

        return [column.name, type, nullable, primaryKey, unique]
          .filter((value) => value.length > 0)
          .join(" ");
      })
      .join(", ");

    const query = `CREATE TABLE ${name}(${columnsString})`;

    this.logger.debug(query);
    const result = await this.db.run(query);
    this.logger.debug(JSON.stringify(result));
  }

  async deleteTable(name: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const query = `DROP TABLE ${name}`;

    this.logger.debug(query);
    await this.db.run(query);
  }

  async getColumns(table: string): Promise<Column[]> {
    if (!this.db) {
      throw new Error("No connection to SQLite database");
    }

    const query = `PRAGMA table_info(${table})`;

    this.logger.debug(query);
    const result = await this.db.all<SqliteColumn[]>(query);

    return result.map((column) => ({
      name: column.name,
      type: column.type,
      nullable: column.notnull === 0,
      primaryKey: column.pk === 1,
      unique: column.pk === 1,
    }));
  }

  async addColumn(table: string, column: Column): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const type = column.type;
    const nullable = column.nullable ? "" : "NOT NULL";
    const primaryKey = column.primaryKey ? "PRIMARY KEY" : "";
    const unique = column.unique ? "UNIQUE" : "";

    const query = `ALTER TABLE ${table} ADD COLUMN ${column.name} ${type} ${nullable} ${primaryKey} ${unique}`;

    this.logger.debug(query);
    await this.db.run(query);
  }

  async deleteColumn(table: string, column: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const query = `ALTER TABLE ${table} DROP COLUMN ${column}`;

    this.logger.debug(query);
    await this.db.run(query);
  }

  async getRows(
    table: string,
    where?: string,
    orderBy?: Record<string, "ASC" | "DESC">,
    limit?: number,
    offset?: number,
  ): Promise<Row[]> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    let query = `SELECT * FROM ${table}`;

    if (where) {
      query += ` WHERE ${where}`;
    }

    if (orderBy) {
      query += ` ORDER BY ${Object.entries(orderBy)
        .map(([column, order]) => `${column} ${order}`)
        .join(", ")}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    this.logger.debug(query);

    return this.db.all<Row[]>(query);
  }

  async addRow(table: string, row: Row): Promise<number> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const columns = Object.keys(row as Record<string, unknown>).join(", ");
    const values = Object.values(row as Record<string, unknown>)
      .map((value) => `"${String(value)}"`)
      .join(", ");
    const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

    this.logger.debug(query);
    const result = await this.db.run(query);

    if (result.lastID === undefined) {
      this.logger.error("Failed to add row to SQLite database");
      throw new Error("Failed to add row to SQLite database");
    }

    return result.lastID;
  }

  async updateRow(table: string, row: Row, where?: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const columns = Object.entries(row as Record<string, unknown>)
      .map(([column, value]) => `${column} = "${String(value)}"`)
      .join(", ");
    let query = `UPDATE ${table} SET ${columns}`;

    if (where) {
      query += ` WHERE ${where}`;
    }

    this.logger.debug(query);
    await this.db.run(query);
  }

  async deleteRow(table: string, where?: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    let query = `DELETE FROM ${table}`;

    if (where) {
      query += ` WHERE ${where}`;
    }

    this.logger.debug(query);
    await this.db.run(query);
  }
}
