import { Component, Input, OnInit } from '@angular/core';
import { Column, DatabaseService } from '../database.service';

@Component({
  selector: 'app-database-table-columns',
  templateUrl: './database-table-columns.component.html',
  styleUrl: './database-table-columns.component.css',
})
export class DatabaseTableColumnsComponent implements OnInit {
  databaseName?: string;
  tableName?: string;
  columns: Column[] = [];
  displayedTableColumns: string[] = ['name', 'type', 'nullable', 'primaryKey', 'unique'];

  constructor(private databaseService: DatabaseService) {}

  @Input()
  set database(database: string) {
    this.databaseName = database;
  }

  @Input()
  set table(table: string) {
    this.tableName = table;
  }

  ngOnInit(): void {
    if (!this.databaseName || !this.tableName) {
      return;
    }

    this.databaseService
      .getColumns(this.databaseName, this.tableName)
      .subscribe((response) => {
        this.columns = response.data;
      });
  }
}
