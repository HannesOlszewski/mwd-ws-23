import fs from "node:fs";
import { Database as Sqlite3Database } from "sqlite3";
import type { Database as SqliteDatabaseType } from "sqlite";
import { open } from "sqlite";
import type { Column, Database, DatabaseOptions } from "types";
import { Logger } from "../utils/logger";

/**
 * The directory where the SQLite databases are stored.
 */
const DATABASE_DIRECTORY = "./databases";

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

  async getTables(): Promise<string[]> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const query = "SELECT name FROM sqlite_master WHERE type = 'table'";

    this.logger.debug(query);
    const tables = await this.db.all<{ name: string }[]>(query);

    return tables.map((table) => table.name);
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
        const primaryKey = column.primaryKey ? "PRIMARY KEY" : "";
        const unique = column.unique ? "UNIQUE" : "";

        return `${column.name} ${type} ${nullable} ${primaryKey} ${unique}`;
      })
      .join(", ");

    const query = `CREATE TABLE ${name} (${columnsString})`;

    this.logger.debug(query);
    await this.db.run(query);
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
    return this.db.all<Column[]>(query);
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
    offset?: number
  ): Promise<unknown[]> {
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
    return this.db.all<unknown[]>(query);
  }
}
