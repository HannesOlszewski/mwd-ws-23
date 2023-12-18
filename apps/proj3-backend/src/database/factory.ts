import type { Database, DatabaseOptions } from "types";
import { Logger } from "../utils/logger";
import { SqliteDatabase } from "./sqlite";

/**
 * Represents the type of database to create.
 */
type DatabaseType = "sqlite";

/**
 * Represents a factory for creating database instances.
 */
export class DatabaseFactory {
  private dbType: DatabaseType;
  private logger: Logger;

  constructor(dbType: DatabaseType) {
    this.dbType = dbType;
    this.logger = new Logger("database-factory");
  }

  /**
   * Creates a new database instance based on the specified options.
   *
   * @param options - The options for creating the database.
   * @returns A promise that resolves to the created database instance.
   * @throws An error if the database type is unknown.
   */
  public async createDatabase(options: DatabaseOptions): Promise<Database> {
    let database: Database;

    switch (this.dbType) {
      case "sqlite":
        database = new SqliteDatabase();
        break;
      default:
        throw new Error("Unknown database type");
    }

    await database.connect(options);

    return database;
  }

  /**
   * Deletes a database based on the specified options.
   *
   * @param options - The options for deleting the database.
   * @returns A Promise that resolves when the database is deleted.
   * @throws An error if the database type is unknown.
   */
  public async deleteDatabase(options: DatabaseOptions): Promise<void> {
    this.logger.log(`Deleting database ${options.database}...`);

    switch (this.dbType) {
      case "sqlite":
        await SqliteDatabase.deleteDatabase(options);
        break;
      default:
        throw new Error("Unknown database type");
    }

    this.logger.log(`Deleted  database ${options.database}`);
  }

  /**
   * Creates a new database instance based on the specified options.
   *
   * @param options - The options for creating the database.
   *
   * @returns A promise that resolves to the created database instance.
   * @throws Error if the database type is unknown.
   */
  public async getDatabase(options: DatabaseOptions): Promise<Database> {
    let database: Database;

    switch (this.dbType) {
      case "sqlite":
        database = new SqliteDatabase();
        break;
      default:
        throw new Error("Unknown database type");
    }

    await database.connect(options);

    return database;
  }

  /**
   * Retrieves the available databases based on the current database type.
   * @returns A promise that resolves to an array of strings representing the available databases.
   * @throws If the database type is unknown.
   */
  public async getAvailableDatabases(): Promise<string[]> {
    switch (this.dbType) {
      case "sqlite":
        return SqliteDatabase.getAvailableDatabases();
      default:
        throw new Error("Unknown database type");
    }
  }
}
