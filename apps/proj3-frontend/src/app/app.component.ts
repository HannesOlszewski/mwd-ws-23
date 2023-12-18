import { Component, OnInit } from '@angular/core';
import { ApiEvent, DatabaseService } from './database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
/**
 * Represents the root component of the application.
 */
export class AppComponent implements OnInit {
  title = 'proj3-frontend';
  databases: string[] = [];

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) {}

  setDatabases(databases: string[]) {
    this.databases = databases;
  }

  /**
   * Retrieves the list of databases from the database service.
   */
  getDatabases(): void {
    this.databaseService.getDatabases().subscribe((response) => {
      if (response.status !== 'ok') {
        return;
      }

      this.databases = response.data;
    });

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (parsedData.type === 'add-database') {
        const databases = [...this.databases, parsedData.database];

        this.setDatabases(databases);
      } else if (parsedData.type === 'delete-database') {
        const databases = this.databases.filter(
          (database) => database !== parsedData.database,
        );

        this.setDatabases(databases);
      }
    });
  }

  ngOnInit(): void {
    this.getDatabases();
  }

  /**
   * Checks if the specified database is the active database.
   * @param database - The name of the database.
   * @returns True if the specified database is the active database, false otherwise.
   */
  isActiveDatabase(database: string): boolean {
    return this.router.url.startsWith(`/databases/${database}`);
  }
}
