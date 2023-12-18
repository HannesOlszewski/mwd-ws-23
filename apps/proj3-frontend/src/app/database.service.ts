import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  routes,
  type Column,
  type ResponseMessage,
  type Row,
  type Table,
} from 'types';
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';

const baseUrl = 'http://localhost:3000';

export type * from 'types/database';

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

/**
 * Creates a URL based on the provided route, database, and table.
 *
 * @param route - The route to be used in the URL.
 * @param database - The optional database parameter to be replaced in the route.
 * @param table - The optional table parameter to be replaced in the route.
 * @returns The generated URL.
 */
function createUrl(route: string, database?: string, table?: string): string {
  const routeWithFilledParameters = route
    .replace(':databaseName', database ?? '')
    .replace(':schemaName', 'default')
    .replace(':tableName', table ?? '');

  return `${baseUrl}${routeWithFilledParameters}`;
}

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
      .connect(createUrl(routes.apiEvents).replace('http', 'ws'))
      .asObservable();
  }

  /**
   * Retrieves the list of databases.
   * @returns An Observable that emits a DatabasesResponse object.
   */
  getDatabases(): Observable<ResponseMessage<string[]>> {
    return this.http.get<ResponseMessage<string[]>>(
      createUrl(routes.databases),
    );
  }

  /**
   * Retrieves the tables for a given database.
   * @param database - The name of the database.
   * @returns An Observable that emits a TablesResponse object.
   */
  getTables(database: string): Observable<ResponseMessage<Table[]>> {
    return this.http.get<ResponseMessage<Table[]>>(
      createUrl(routes.tables, database),
    );
  }

  /**
   * Creates a table in the specified database.
   *
   * @param database - The name of the database.
   * @param table - The name of the table to be created.
   * @returns An Observable that emits an EmptyMutationResponse when the table creation is successful.
   */
  createTable(database: string, table: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(createUrl(routes.tables, database), {
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
    });
  }

  /**
   * Deletes a table from the specified database.
   * @param database The name of the database.
   * @param table The name of the table to delete.
   * @returns An Observable that emits an EmptyMutationResponse.
   */
  deleteTable(database: string, table: string): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(
      createUrl(routes.tables, database),
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
  getColumns(
    database: string,
    table: string,
  ): Observable<ResponseMessage<Column[]>> {
    return this.http.get<ResponseMessage<Column[]>>(
      createUrl(routes.columns, database, table),
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
  ): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      createUrl(routes.columns, database, table),
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
  ): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(
      createUrl(routes.columns, database, table),
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
  getRows(database: string, table: string): Observable<ResponseMessage<Row[]>> {
    return this.http.get<ResponseMessage<Row[]>>(
      createUrl(routes.rows, database, table),
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
  ): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      createUrl(routes.rows, database, table),
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
  ): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      createUrl(routes.rows, database, table),
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
  ): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(
      createUrl(routes.rows, database, table),
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
