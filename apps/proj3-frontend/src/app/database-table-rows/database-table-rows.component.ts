import { Component, Input, OnInit } from '@angular/core';
import { ApiEvent, Column, DatabaseService, Row } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableRowDeleteDialogComponent } from '../database-table-row-delete-dialog/database-table-row-delete-dialog.component';
import { DatabaseTableRowNewDialogComponent } from '../database-table-row-new-dialog/database-table-row-new-dialog.component';
import { DatabaseTableRowEditDialogComponent } from '../database-table-row-edit-dialog/database-table-row-edit-dialog.component';

@Component({
  selector: 'app-database-table-rows',
  templateUrl: './database-table-rows.component.html',
  styleUrl: './database-table-rows.component.css',
})
/**
 * Represents a component that displays the rows of a database table.
 */
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

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (
        parsedData.type === 'add-row' &&
        parsedData.database === this.databaseName &&
        parsedData.table === this.tableName
      ) {
        this.rows = [...this.rows, parsedData.row];
      } else if (
        parsedData.type === 'update-row' &&
        parsedData.database === this.databaseName &&
        parsedData.table === this.tableName
      ) {
        this.rows = this.rows.map((row) => {
          if (row['id'] === parsedData.row['id']) {
            return parsedData.row;
          }

          return row;
        });
      } else if (
        parsedData.type === 'delete-row' &&
        parsedData.database === this.databaseName &&
        parsedData.table === this.tableName
      ) {
        this.rows = this.rows.filter(
          (row) => row['id'] !== parsedData.row['id'],
        );
      }
    });
  }

  /**
   * Opens a dialog for creating a new row in the database table.
   * If the database name or table name is not provided, the function returns early.
   * The dialog displays the provided database name, table name, and columns.
   * After the dialog is closed, the function creates a new row in the database table
   * using the provided database name, table name, and the result from the dialog.
   */
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
          .subscribe();
      }
    });
  }

  /**
   * Opens the edit row dialog for the specified row.
   *
   * @param row - The row to be edited.
   */
  openEditRowDialog(row: Row) {
    if (!this.databaseName || !this.tableName || !('id' in row)) {
      return;
    }

    const databaseName = this.databaseName;
    const tableName = this.tableName;
    const columns = this.columns;

    const dialogRef = this.dialog.open(DatabaseTableRowEditDialogComponent, {
      data: {
        databaseName,
        tableName,
        columns,
        row,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .updateRow(databaseName, tableName, result.row)
          .subscribe();
      }
    });
  }

  /**
   * Opens a dialog for deleting a row from the database table.
   *
   * @param row - The row to be deleted.
   */
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
          .subscribe();
      }
    });
  }
}
