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
   * @param options The options for configuring the database connection.
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
}
