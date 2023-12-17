import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000';

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

interface DatabasesResponse {
  status: string;
  data: string[];
}

interface TablesResponse {
  status: string;
  data: string[];
}

interface ColumnsResponse {
  status: string;
  data: Column[];
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
}
