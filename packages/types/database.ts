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
  database: string;
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

  /**
   * Gets the schemas in the database.
   *
   * @returns A promise that resolves with the schemas in the database.
   */
  getSchemas(): Promise<string[]>;

  /**
   * Gets the tables in the database.
   *
   * @returns A promise that resolves with the tables in the database.
   */
  getTables(): Promise<Table[]>;

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

  /**
   * Gets the columns in a table.
   *
   * @param table - The name of the table.
   *
   * @returns A promise that resolves with the columns in the table.
   */
  getColumns: (table: string) => Promise<Column[]>;

  /**
   * Adds a column to a table.
   *
   * @param table - The name of the table.
   * @param column - The column to add.
   *
   * @returns A promise that resolves when the column is added.
   */
  addColumn: (table: string, column: Column) => Promise<void>;

  /**
   * Deletes a column from a table.
   *
   * @param table - The name of the table.
   * @param column - The name of the column to delete.
   *
   * @returns A promise that resolves when the column is deleted.
   */
  deleteColumn: (table: string, column: string) => Promise<void>;

  /**
   * Gets the rows in a table.
   *
   * @param table - The name of the table.
   * @param where - The where clause.
   * @param orderBy - The order by clause.
   * @param limit - The limit clause.
   * @param offset - The offset clause.
   *
   * @returns A promise that resolves with the rows in the table.
   */
  getRows: (
    table: string,
    where?: string,
    orderBy?: Record<string, "ASC" | "DESC">,
    limit?: number,
    offset?: number
  ) => Promise<unknown[]>;

  /**
   * Adds a row to a table.
   *
   * @param table - The name of the table.
   * @param row - The row to add.
   *
   * @returns A promise that resolves with the new id when the row is added.
   */
  addRow: (table: string, row: Row) => Promise<number>;

  /**
   * Updates a row in a table.
   *
   * @param table - The name of the table.
   * @param row - The row to update.
   * @param where - The where clause.
   *
   * @returns A promise that resolves when the row is updated.
   */
  updateRow: (
    table: string,
    row: Row,
    where?: string
  ) => Promise<void>;

  /**
   * Deletes a row from a table.
   *
   * @param table - The name of the table.
   * @param where - The where clause.
   *
   * @returns A promise that resolves when the row is deleted.
   */
  deleteRow: (table: string, where?: string) => Promise<void>;
}

/**
 * Represents a database table.
 */
export interface Table {
  /**
   * The name of the table.
   */
  name: string;
  /**
   * The number of columns in the table.
   */
  numColumns: number;
  /**
   * The number of rows in the table.
   */
  numRows: number;
}

/**
 * Represents a column type.
 */
export type ColumnType = "TEXT" | "INTEGER" | "FLOAT";

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
  type: ColumnType;
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

/**
 * Represents a row in the database.
 */
export type Row = Record<string, unknown>;
