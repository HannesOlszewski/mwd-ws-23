import { Database as Sqlite3Database } from "sqlite3";
import type { Database as SqliteDatabaseType } from "sqlite";
import { open } from "sqlite";
import type { Database, DatabaseOptions } from "types";
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
}
