import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  getDatabases(): Observable<DatabasesResponse> {
    return this.http.get<DatabasesResponse>(`${baseUrl}/databases`);
  }

  getTables(database: string): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables`,
    );
  }

  getColumns(database: string, table: string): Observable<ColumnsResponse> {
    return this.http.get<ColumnsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/columns`,
    );
  }

  getRows(database: string, table: string): Observable<RowsResponse> {
    return this.http.get<RowsResponse>(
      `${baseUrl}/databases/${database}/schemas/default/tables/${table}/rows`,
    );
  }
}
