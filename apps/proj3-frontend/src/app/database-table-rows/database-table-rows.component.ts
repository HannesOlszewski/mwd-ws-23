import { Component, Input, OnInit } from '@angular/core';
import { Column, DatabaseService, Row } from '../database.service';

@Component({
  selector: 'app-database-table-rows',
  templateUrl: './database-table-rows.component.html',
  styleUrl: './database-table-rows.component.css',
})
export class DatabaseTableRowsComponent implements OnInit {
  databaseName?: string;
  tableName?: string;
  columns: Column[] = [];
  displayedTableColumns: string[] = [];
  rows: Row[] = [];

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
        this.displayedTableColumns = this.columns.map((column) => column.name);
      });

    this.databaseService
      .getRows(this.databaseName, this.tableName)
      .subscribe((response) => {
        this.rows = response.data;
      });
  }
}
