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
 * The name of the default database.
 */
const DEFAULT_DATABASE_NAME = "default";

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

  async connect(options: DatabaseOptions): Promise<void> {
    // TODO: handle case when already connected to a different database than specified in options
    const dbName: string = options.database ?? DEFAULT_DATABASE_NAME;

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

    const schemas = await this.db.all<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type = 'table'"
    );

    return schemas.map((schema) => schema.name);
  }

  async getTables(): Promise<string[]> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const tables = await this.db.all<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type = 'table'"
    );

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
        const type = column.type ?? "TEXT";
        const nullable = column.nullable ? "" : "NOT NULL";
        const primaryKey = column.primaryKey ? "PRIMARY KEY" : "";
        const unique = column.unique ? "UNIQUE" : "";

        return `${column.name} ${type} ${nullable} ${primaryKey} ${unique}`;
      })
      .join(", ");

    this.logger.log(`Creating table ${name} with ${columns.length} columns...`);
    await this.db.run(`CREATE TABLE ${name} (${columnsString})`);
    this.logger.log(`Created table ${name}`);
  }

  async deleteTable(name: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    this.logger.log(`Dropping table ${name}...`);
    await this.db.run(`DROP TABLE ${name}`);
    this.logger.log(`Dropped table ${name}`);
  }

  async getColumns(table: string): Promise<Column[]> {
    if (!this.db) {
      throw new Error("No connection to SQLite database");
    }

    return this.db.all<Column[]>(`PRAGMA table_info(${table})`);
  }

  async addColumn(table: string, column: Column): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    const type = column.type ?? "TEXT";
    const nullable = column.nullable ? "" : "NOT NULL";
    const primaryKey = column.primaryKey ? "PRIMARY KEY" : "";
    const unique = column.unique ? "UNIQUE" : "";

    this.logger.log(`Adding column ${column.name} to table ${table}...`);
    await this.db.run(
      `ALTER TABLE ${table} ADD COLUMN ${column.name} ${type} ${nullable} ${primaryKey} ${unique}`
    );
    this.logger.log(`Added column ${column.name} to table ${table}`);
  }

  async deleteColumn(table: string, column: string): Promise<void> {
    if (!this.db) {
      this.logger.error("No connection to SQLite database");
      throw new Error("No connection to SQLite database");
    }

    this.logger.log(`Dropping column ${column} from table ${table}...`);
    await this.db.run(`ALTER TABLE ${table} DROP COLUMN ${column}`);
    this.logger.log(`Dropped column ${column} from table ${table}`);
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
        .join(",")}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return this.db.all<unknown[]>(query);
  }
}
