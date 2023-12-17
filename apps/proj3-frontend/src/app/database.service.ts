import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

const baseUrl = 'http://localhost:3000';

/**
 * Represents a table in the database.
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
 * Represents a column in the database.
 */
export interface Column {
  /**
   * The name of the column.
   */
  name: string;
  /**
   * The type of the column.
   */
  type: string;
  /**
   * Whether the column can be null.
   */
  nullable: boolean;
  /**
   * Whether the column is a primary key.
   */
  primaryKey: boolean;
  /**
   * Whether the column is unique.
   */
  unique: boolean;
}

/**
 * Represents a row in the database.
 */
export type Row = Record<string, unknown>;

/**
 * Represents the response from the server when retrieving databases.
 */
interface DatabasesResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The names of the databases.
   */
  data: string[];
}

/**
 * Represents the response object for tables.
 */
interface TablesResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The tables in the database.
   */
  data: Table[];
}

/**
 * Represents the response object for columns.
 */
interface ColumnsResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The columns in the table.
   */
  data: Column[];
}

/**
 * Represents the response object for rows.
 */
interface RowsResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The rows in the table.
   */
  data: Row[];
}

/**
 * Represents the response object for mutations.
 */
interface EmptyMutationResponse {
  /**
   * The status of the response.
   */
  status: string;
  /**
   * The message of the response.
   */
  message?: string;
}

/**
 * Represents an API event.
 */
export type ApiEvent =
  | {
      type: 'add-table';
      database: string;
      table: string;
    }
  | {
      type: 'delete-table';
      database: string;
      table: string;
    }
  | {
      type: 'add-column';
      database: string;
      table: string;
      column: Column;
    }
  | {
      type: 'delete-column';
      database: string;
      table: string;
      column: string;
    }
  | { type: 'add-row'; database: string; table: string; row: Row }
  | {
      type: 'update-row';
      database: string;
      table: string;
      row: Row;
    }
  | {
      type: 'delete-row';
      database: string;
      table: string;
      row: Row;
    };

@Injectable({
  providedIn: 'root',
})
/**
 * Service for interacting with the database.
 */
export class DatabaseService {
  private apiEvents: Observable<MessageEvent<string>>;

  constructor(
    private http: HttpClient,
    private ws: WebsocketService,
  ) {
    this.apiEvents = this.ws
      .connect(`${baseUrl.replace('http', 'ws')}/ws`)
      .asObservable();
  }

  /**
   * Retrieves the list of databases.
   * @returns An Observable that emits a DatabasesResponse object.
   */
  getDatabases(): Observable<DatabasesResponse> {
    return this.http.get<DatabasesResponse>(`${baseUrl}/databases`);
  }

  /**
   * Retrieves the tables for a given database.
   * @param database - The name of the database.
   * @returns An Observable that emits a TablesResponse object.
   */
  getTables(database: string): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables`,
    );
  }

  /**
   * Creates a table in the specified database.
   *
   * @param database - The name of the database.
   * @param table - The name of the table to be created.
   * @returns An Observable that emits an EmptyMutationResponse when the table creation is successful.
   */
  createTable(
    database: string,
    table: string,
  ): Observable<EmptyMutationResponse> {
    return this.http.post<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables`,
      {
        name: table,
        columns: [
          {
            name: 'id',
            type: 'INTEGER',
            nullable: false,
            primaryKey: true,
            unique: true,
          },
        ],
      },
    );
  }

  /**
   * Deletes a table from the specified database.
   * @param database The name of the database.
   * @param table The name of the table to delete.
   * @returns An Observable that emits an EmptyMutationResponse.
   */
  deleteTable(
    database: string,
    table: string,
  ): Observable<EmptyMutationResponse> {
    return this.http.delete<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables`,
      {
        body: {
          name: table,
        },
      },
    );
  }

  /**
   * Retrieves the columns of a specified table in a database.
   * @param database - The name of the database.
   * @param table - The name of the table.
   * @returns An Observable that emits a ColumnsResponse object.
   */
  getColumns(database: string, table: string): Observable<ColumnsResponse> {
    return this.http.get<ColumnsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/columns`,
    );
  }

  /**
   * Creates a new column in the specified table of a database.
   * @param database - The name of the database.
   * @param table - The name of the table.
   * @param column - The column object containing the column details.
   * @returns An Observable that emits an EmptyMutationResponse.
   */
  createColumn(
    database: string,
    table: string,
    column: Column,
  ): Observable<EmptyMutationResponse> {
    return this.http.post<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/columns`,
      column,
    );
  }

  /**
   * Deletes a column from a table in a database.
   * @param database - The name of the database.
   * @param table - The name of the table.
   * @param column - The name of the column to be deleted.
   * @returns An Observable that emits an EmptyMutationResponse.
   */
  deleteColumn(
    database: string,
    table: string,
    column: string,
  ): Observable<EmptyMutationResponse> {
    return this.http.delete<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/columns`,
      {
        body: {
          name: column,
        },
      },
    );
  }

  /**
   * Retrieves the rows from a specific table in a database.
   * @param database The name of the database.
   * @param table The name of the table.
   * @returns An Observable that emits a RowsResponse object containing the rows.
   */
  getRows(database: string, table: string): Observable<RowsResponse> {
    return this.http.get<RowsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
    );
  }

  /**
   * Creates a new row in the specified table of the given database.
   * @param database The name of the database.
   * @param table The name of the table.
   * @param row The row object to be created.
   * @returns An Observable that emits an EmptyMutationResponse when the row is successfully created.
   */
  createRow(
    database: string,
    table: string,
    row: Row,
  ): Observable<EmptyMutationResponse> {
    return this.http.post<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
      row,
    );
  }

  /**
   * Updates a row in the specified table of a database.
   * @param database The name of the database.
   * @param table The name of the table.
   * @param row The row object to be updated.
   * @returns An Observable that emits an EmptyMutationResponse when the update is successful.
   */
  updateRow(
    database: string,
    table: string,
    row: Row,
  ): Observable<EmptyMutationResponse> {
    return this.http.put<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
      {
        row,
        where: `id=${row['id'] ?? -1}`,
      },
    );
  }

  /**
   * Deletes a row from the specified table in the database.
   *
   * @param database - The name of the database.
   * @param table - The name of the table.
   * @param row - The row object to be deleted.
   * @returns An Observable that emits an EmptyMutationResponse when the deletion is successful.
   */
  deleteRow(
    database: string,
    table: string,
    row: Row,
  ): Observable<EmptyMutationResponse> {
    return this.http.delete<EmptyMutationResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
      {
        body: {
          where: Object.entries(row)
            .map(([column, value]) =>
              typeof value === 'string'
                ? `${column}="${value}"`
                : `${column}=${value}`,
            )
            .join(' AND '),
        },
      },
    );
  }

  /**
   * Retrieves the API events as an Observable of MessageEvent<string>.
   * @returns An Observable of MessageEvent<string> representing the API events.
   */
  getApiEvents(): Observable<MessageEvent<string>> {
    return this.apiEvents;
  }
}
