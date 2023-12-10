/**
 * Represents the options for configuring a database connection.
 */
export interface DatabaseOptions {
  /**
   * The host of the database.
   */
  host?: string;
  /**
   * The port of the database.
   */
  port?: number;
  /**
   * The username to use when connecting to the database.
   */
  username?: string;
  /**
   * The password to use when connecting to the database.
   */
  password?: string;
  /**
   * The name of the database to connect to.
   */
  database?: string;
}

/**
 * Represents a database connection.
 */
export interface Database {
  /**
   * Connects to the database.
   *
   * @param options - The options for configuring the database connection.
   *
   * @returns A promise that resolves when the connection is established.
   */
  connect: (options: DatabaseOptions) => Promise<void>;

  /**
   * Closes the connection to the database.
   *
   * @returns A promise that resolves when the connection is closed.
   */
  closeConnection: () => Promise<void>;

  /**
   * Checks whether the connection to the database is open.
   *
   * @returns True if the connection is open, false otherwise.
   */
  isConnectedToDatabase: () => boolean;

  getSchemas(): Promise<string[]>;

  /**
   * Gets the tables in the database.
   *
   * @returns A promise that resolves with the tables in the database.
   */
  getTables(): Promise<string[]>;

  /**
   * Creates a table in the database.
   *
   * @param name - The name of the table.
   * @param columns - The columns of the table.
   *
   * @returns A promise that resolves when the table is created.
   */
  createTable: (name: string, columns: Column[]) => Promise<void>;

  /**
   * Deletes a table from the database.
   *
   * @param name - The name of the table.
   *
   * @returns A promise that resolves when the table is deleted.
   */
  deleteTable: (name: string) => Promise<void>;
}

/**
 * Represents a column in a database table.
 */
export interface Column {
  /**
   * The name of the column.
   */
  name: string;
  /**
   * The type of the column.
   */
  type?: "TEXT" | "INTEGER" | "REAL" | "BLOB";
  /**
   * Whether the column is nullable.
   */
  nullable?: boolean;
  /**
   * Whether the column is a primary key.
   */
  primaryKey?: boolean;
  /**
   * Whether the column is unique.
   */
  unique?: boolean;
}
