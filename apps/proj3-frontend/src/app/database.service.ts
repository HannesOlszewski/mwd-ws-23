import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000';

interface DatabasesResponse {
  status: string;
  data: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  getDatabases(): Observable<DatabasesResponse> {
    return this.http.get<DatabasesResponse>(`${baseUrl}/databases`);
  }
}
