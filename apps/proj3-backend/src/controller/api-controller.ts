import type {
  ApiEvent,
  Column,
  Database,
  DatabaseOptions,
  EventName,
  Table,
} from "types";
import { DatabaseFactory } from "../database/factory";
import { Logger } from "../utils/logger";

/**
 * Represents a database connection.
 */
interface DatabaseConnection {
  /**
   * The name of the database.
   */
  name: string;
  /**
   * The database instance.
   */
  database: Database;
  /**
   * The date when the database was last accessed.
   */
  lastAccessed: Date;
}

/**
 * Handles API calls for database operations.
 */
export class ApiController {
  private logger: Logger;
  private databaseFactory: DatabaseFactory;
  private databaseConnections: DatabaseConnection[];
  private eventListeners: Record<EventName, (<T>(data?: T) => void)[]>;

  constructor() {
    this.logger = new Logger("api-controller");
    this.databaseFactory = new DatabaseFactory("sqlite");
    this.databaseConnections = [];
    this.eventListeners = {
      "add-database": [],
      "delete-database": [],
      "add-table": [],
      "delete-table": [],
      "add-column": [],
      "delete-column": [],
      "add-row": [],
      "update-row": [],
      "delete-row": [],
    };
  }

  /**
   * Retrieves a database connection based on the provided options.
   * If a connection with the same name already exists, it updates the lastAccessed property and returns the existing connection.
   * Otherwise, it creates a new connection, adds it to the list of connections, and returns the new connection.
   *
   * @param options - The options for the database connection.
   *
   * @returns A promise that resolves to the retrieved or created database connection.
   */
  private async getDatabaseConnection(
    options: DatabaseOptions,
  ): Promise<DatabaseConnection> {
    const activeDatabaseConnection = this.databaseConnections.find(
      (connection) => connection.name === options.database,
    );

    if (activeDatabaseConnection) {
      activeDatabaseConnection.lastAccessed = new Date();

      return activeDatabaseConnection;
    }

    const database = await this.databaseFactory.getDatabase({
      database: options.database,
    });
    const newDatabaseConnection = {
      name: options.database,
      database,
      lastAccessed: new Date(),
    };

    this.databaseConnections.push(newDatabaseConnection);

    return newDatabaseConnection;
  }

  /**
   * Creates a database using the specified options.
   *
   * @param options - The options for creating the database.
   * @returns A promise that resolves when the database is created.
   */
  async createDatabase(options: DatabaseOptions): Promise<void> {
    await this.databaseFactory.createDatabase(options);

    this.emit("add-database", {
      type: "add-database",
      database: options.database,
    });
  }

  /**
   * Deletes a database using the specified options.
   * @param options - The options for deleting the database.
   * @returns A Promise that resolves when the database is successfully deleted.
   */
  async deleteDatabase(options: DatabaseOptions): Promise<void> {
    await this.databaseFactory.deleteDatabase(options);

    this.emit("delete-database", {
      type: "delete-database",
      database: options.database,
    });
  }

  /**
   * Closes all the database connections.
   *
   * @returns A Promise that resolves when all the connections are closed.
   */
  async close(): Promise<void> {
    await Promise.all(
      this.databaseConnections.map((databaseConnection) =>
        databaseConnection.database.closeConnection(),
      ),
    );
  }

  /**
   * Retrieves the list of available databases.
   *
   * @returns A promise that resolves to an array of strings representing the available databases.
   */
  async getAvailableDatabases(): Promise<string[]> {
    return this.databaseFactory.getAvailableDatabases();
  }

  /**
   * Retrieves the list of schemas from the database.
   *
   * @param options - The database options.
   *
   * @returns A promise that resolves to an array of strings representing the schemas.
   */
  async getSchemas(options: DatabaseOptions): Promise<string[]> {
    const databaseConnection = await this.getDatabaseConnection(options);

    return databaseConnection.database.getSchemas();
  }

  /**
   * Retrieves the list of tables from the database.
   *
   * @param options - The database options.
   *
   * @returns A promise that resolves to an array of table names.
   */
  async getTables(options: DatabaseOptions): Promise<Table[]> {
    const databaseConnection = await this.getDatabaseConnection(options);

    return databaseConnection.database.getTables();
  }

  /**
   * Creates a table in the database.
   *
   * @param options - The database options.
   * @param name - The name of the table.
   * @param columns - The columns of the table.
   *
   * @returns A Promise that resolves when the table is created.
   */
  async createTable(
    options: DatabaseOptions,
    name: string,
    columns: Column[],
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    await databaseConnection.database.createTable(name, columns);

    this.emit("add-table", {
      type: "add-table",
      database: options.database,
      table: name,
    });
  }

  /**
   * Deletes a table from the database.
   *
   * @param options - The database options.
   * @param name - The name of the table to delete.
   *
   * @returns A promise that resolves when the table is deleted.
   */
  async deleteTable(options: DatabaseOptions, name: string): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    await databaseConnection.database.deleteTable(name);

    this.emit("delete-table", {
      type: "delete-table",
      database: options.database,
      table: name,
    });
  }

  /**
   * Retrieves the columns of a specified table from the database.
   *
   * @param options - The database connection options.
   * @param table - The name of the table.
   *
   * @returns A promise that resolves to an array of Column objects representing the columns of the table.
   */
  async getColumns(options: DatabaseOptions, table: string): Promise<Column[]> {
    const databaseConnection = await this.getDatabaseConnection(options);

    return databaseConnection.database.getColumns(table);
  }

  /**
   * Adds a column to a table in the database.
   *
   * @param options - The database options.
   * @param table - The name of the table.
   * @param column - The column to be added.
   *
   * @returns A Promise that resolves when the column is added successfully.
   */
  async addColumn(
    options: DatabaseOptions,
    table: string,
    column: Column,
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    await databaseConnection.database.addColumn(table, column);

    this.emit("add-column", {
      type: "add-column",
      database: options.database,
      table,
      column,
    });
  }

  /**
   * Deletes a column from a table in the database.
   *
   * @param options - The database options.
   * @param table - The name of the table.
   * @param column - The name of the column to delete.
   *
   * @returns A Promise that resolves when the column is deleted.
   */
  async deleteColumn(
    options: DatabaseOptions,
    table: string,
    column: string,
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    await databaseConnection.database.deleteColumn(table, column);

    this.emit("delete-column", {
      type: "delete-column",
      database: options.database,
      table,
      column,
    });
  }

  /**
   * Retrieves rows from the database table.
   *
   * @param options - The database connection options.
   * @param table - The name of the table to retrieve rows from.
   * @param limit - The maximum number of rows to retrieve.
   * @param offset - The number of rows to skip before starting to retrieve.
   * @param where - The WHERE clause to filter the rows.
   * @param orderBy - The column names and sort order for ordering the rows.
   *
   * @returns A promise that resolves to an array of retrieved rows.
   */
  async getRows(
    options: DatabaseOptions,
    table: string,
    limit?: number,
    offset?: number,
    where?: string,
    orderBy?: Record<string, "ASC" | "DESC">,
  ): Promise<unknown[]> {
    const databaseConnection = await this.getDatabaseConnection(options);

    return databaseConnection.database.getRows(
      table,
      where,
      orderBy,
      limit,
      offset,
    );
  }

  /**
   * Adds a row to the database table.
   *
   * @param options - The database connection options.
   * @param table - The name of the table to add the row to.
   * @param row - The row to add.
   *
   * @returns A promise that resolves when the row is added.
   */
  async addRow(
    options: DatabaseOptions,
    table: string,
    row: Record<string, unknown>,
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    const id = await databaseConnection.database.addRow(table, row);

    this.emit("add-row", {
      type: "add-row",
      database: options.database,
      table,
      row: {
        ...row,
        id,
      },
    });
  }

  /**
   * Updates a row in the database table.
   *
   * @param options - The database connection options.
   * @param table - The name of the table to update the row in.
   * @param row - The row to update.
   * @param where - The WHERE clause to filter the rows.
   *
   * @returns A promise that resolves when the row is updated.
   */
  async updateRow(
    options: DatabaseOptions,
    table: string,
    row: Record<string, unknown>,
    where?: string,
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    await databaseConnection.database.updateRow(table, row, where);

    this.emit("update-row", {
      type: "update-row",
      database: options.database,
      table,
      row,
    });
  }

  /**
   * Deletes a row from the database table.
   *
   * @param options - The database connection options.
   * @param table - The name of the table to delete the row from.
   * @param where - The WHERE clause to filter the rows.
   *
   * @returns A promise that resolves when the row is deleted.
   */
  async deleteRow(
    options: DatabaseOptions,
    table: string,
    where?: string,
  ): Promise<void> {
    const databaseConnection = await this.getDatabaseConnection(options);

    const rows = await databaseConnection.database.getRows(table, where);
    const row = rows[0];
    await databaseConnection.database.deleteRow(table, where);

    this.emit("delete-row", {
      type: "delete-row",
      database: options.database,
      table,
      row,
    });
  }

  /**
   * Adds a listener for the specified event.
   *
   * @param eventName - The name of the event to listen to.
   * @param listener - The listener function.
   */
  on<T extends ApiEvent>(
    eventName: EventName,
    listener: (data?: T) => void,
  ): void {
    this.eventListeners[eventName].push(listener as (data?: unknown) => void);
  }

  /**
   * Removes a listener for the specified event.
   *
   * @param eventName - The name of the event.
   * @param listener - The listener function to remove.
   */
  off<T extends ApiEvent>(
    eventName: EventName,
    listener: (data?: T) => void,
  ): void {
    this.eventListeners[eventName] = this.eventListeners[eventName].filter(
      (eventListener) => eventListener !== listener,
    );
  }

  /**
   * Emits an event to all the listeners.
   *
   * @param eventName - The name of the event to emit.
   * @param data - The data to emit.
   */
  private emit<T extends ApiEvent>(eventName: EventName, data?: T): void {
    this.eventListeners[eventName].forEach((listener) => {
      listener(data);
    });
  }
}
