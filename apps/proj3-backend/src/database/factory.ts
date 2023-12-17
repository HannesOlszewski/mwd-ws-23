import type { Database, DatabaseOptions } from "types";
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

  constructor(dbType: DatabaseType) {
    this.dbType = dbType;
  }

  /**
   * Creates a new database instance based on the specified options.
   *
   * @param options - The options for creating the database.
   *
   * @returns A promise that resolves to the created database instance.
   * @throws Error if the database type is unknown.
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
