import { Component, Input } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-database-tables',
  templateUrl: './database-tables.component.html',
  styleUrl: './database-tables.component.css',
})
export class DatabaseTablesComponent {
  databaseName?: string;
  tables: string[] = [];

  constructor(private databaseService: DatabaseService) {}

  @Input()
  set database(database: string) {
    this.databaseName = database;
    this.databaseService.getTables(database).subscribe((response) => {
      this.tables = response.data;
    });
  }
}
