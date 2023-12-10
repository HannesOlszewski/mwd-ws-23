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
      throw new Error("No connection to SQLite database");
    }

    const schemas = await this.db.all<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type = 'table'"
    );

    return schemas.map((schema) => schema.name);
  }

  async getTables(): Promise<string[]> {
    if (!this.db) {
      throw new Error("No connection to SQLite database");
    }

    const tables = await this.db.all<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type = 'table'"
    );

    return tables.map((table) => table.name);
  }

  async createTable(name: string, columns: Column[]): Promise<void> {
    if (!this.db) {
      throw new Error("No connection to SQLite database");
    }

    if (columns.length === 0) {
      throw new Error("Cannot create table with no columns");
    }

    if (!columns.some((column) => column.primaryKey)) {
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
      throw new Error("No connection to SQLite database");
    }

    this.logger.log(`Dropping table ${name}...`);
    await this.db.run(`DROP TABLE ${name}`);
    this.logger.log(`Dropped table ${name}`);
  }
}
