import { Component, Input, OnInit } from '@angular/core';
import { ApiEvent, Column, DatabaseService } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableColumnNewDialogComponent } from '../database-table-column-new-dialog/database-table-column-new-dialog.component';
import { DatabaseTableColumnDeleteDialogComponent } from '../database-table-column-delete-dialog/database-table-column-delete-dialog.component';

@Component({
  selector: 'app-database-table-columns',
  templateUrl: './database-table-columns.component.html',
  styleUrl: './database-table-columns.component.css',
})
/**
 * Represents a component that displays the columns of a database table.
 */
export class DatabaseTableColumnsComponent implements OnInit {
  databaseName?: string;
  tableName?: string;
  columns: Column[] = [];
  displayedTableColumns: string[] = [
    'name',
    'type',
    'nullable',
    'primaryKey',
    'unique',
    'actions',
  ];

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
      });

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (parsedData.type === 'add-column') {
        this.columns = [...this.columns, parsedData.column];
      } else if (parsedData.type === 'delete-column') {
        this.columns = this.columns.filter(
          (column) => column.name !== parsedData.column,
        );
      }
    });
  }

  /**
   * Opens a dialog to create a new column in the database table.
   * If the database name or table name is not provided, the function returns early.
   * The dialog allows the user to enter the column details such as name, type, nullability, primary key, and uniqueness.
   * After the dialog is closed, the function creates the column using the provided details by calling the database service.
   */
  openNewColumnDialog() {
    if (!this.databaseName || !this.tableName) {
      return;
    }

    const dialogRef = this.dialog.open(DatabaseTableColumnNewDialogComponent, {
      data: {
        databaseName: this.databaseName,
        tableName: this.tableName,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .createColumn(result.databaseName, result.tableName, {
            name: result.columnName,
            type: result.columnType,
            nullable: result.isNullable,
            primaryKey: result.isPrimaryKey,
            unique: result.isUnique,
          })
          .subscribe();
      }
    });
  }

  /**
   * Opens a dialog to delete a column from the database table.
   * 
   * @param column - The name of the column to be deleted.
   */
  openDeleteColumnDialog(column: string) {
    if (!this.databaseName || !this.tableName) {
      return;
    }

    const databaseName = this.databaseName;
    const tableName = this.tableName;

    const dialogRef = this.dialog.open(
      DatabaseTableColumnDeleteDialogComponent,
      {
        data: {
          databaseName,
          tableName,
          columnName: column,
        },
        minWidth: '400px',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .deleteColumn(databaseName, tableName, column)
          .subscribe();
      }
    });
  }
}
