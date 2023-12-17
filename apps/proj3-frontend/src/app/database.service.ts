import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';

const baseUrl = 'http://localhost:3000';

export interface Table {
  name: string;
  numColumns: number;
  numRows: number;
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

export type Row = Record<string, unknown>;

interface DatabasesResponse {
  status: string;
  data: string[];
}

interface TablesResponse {
  status: string;
  data: Table[];
}

interface ColumnsResponse {
  status: string;
  data: Column[];
}

interface RowsResponse {
  status: string;
  data: Row[];
}

interface EmptyMutationResponse {
  status: string;
  message?: string;
}

export type EventName =
  | 'add-table'
  | 'delete-table'
  | 'add-column'
  | 'delete-column';

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

  getDatabases(): Observable<DatabasesResponse> {
    return this.http.get<DatabasesResponse>(`${baseUrl}/databases`);
  }

  getTables(database: string): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables`,
    );
  }

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

  getColumns(database: string, table: string): Observable<ColumnsResponse> {
    return this.http.get<ColumnsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/columns`,
    );
  }

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

  getRows(database: string, table: string): Observable<RowsResponse> {
    return this.http.get<RowsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
    );
  }

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

  getApiEvents(): Observable<MessageEvent<string>> {
    return this.apiEvents;
  }
}
