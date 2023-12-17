import { Component, Input, OnInit } from '@angular/core';
import { Column, DatabaseService, Row } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableRowDeleteDialogComponent } from '../database-table-row-delete-dialog/database-table-row-delete-dialog.component';
import { DatabaseTableRowNewDialogComponent } from '../database-table-row-new-dialog/database-table-row-new-dialog.component';

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

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
  ) {}

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
        this.displayedTableColumns = [
          ...this.columns.map((column) => column.name),
          'actions',
        ];
      });

    this.databaseService
      .getRows(this.databaseName, this.tableName)
      .subscribe((response) => {
        this.rows = response.data;
      });
  }

  openNewRowDialog() {
    if (!this.databaseName || !this.tableName) {
      return;
    }

    const databaseName = this.databaseName;
    const tableName = this.tableName;
    const columns = this.columns;

    const dialogRef = this.dialog.open(DatabaseTableRowNewDialogComponent, {
      data: {
        databaseName,
        tableName,
        columns,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .createRow(databaseName, tableName, result)
          .subscribe((createRowResponse) => {
            if (
              createRowResponse.status === 'error' &&
              'message' in createRowResponse
            ) {
              console.error(createRowResponse);
              return;
            }

            this.databaseService
              .getRows(databaseName, tableName)
              .subscribe((response) => {
                this.rows = response.data;
              });
          });
      }
    });
  }

  openDeleteRowDialog(row: Row) {
    if (!this.databaseName || !this.tableName || !('id' in row)) {
      return;
    }

    const databaseName = this.databaseName;
    const tableName = this.tableName;

    const dialogRef = this.dialog.open(DatabaseTableRowDeleteDialogComponent, {
      data: {
        databaseName,
        tableName,
        row,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .deleteRow(databaseName, tableName, row)
          .subscribe((deleteRowResponse) => {
            if (
              deleteRowResponse.status === 'error' &&
              'message' in deleteRowResponse
            ) {
              console.error(deleteRowResponse);
              return;
            }

            this.databaseService
              .getRows(databaseName, tableName)
              .subscribe((response) => {
                this.rows = response.data;
              });
          });
      }
    });
  }
}
