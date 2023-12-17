import { Component, Input, OnInit } from '@angular/core';
import { Column, DatabaseService } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableColumnNewDialogComponent } from '../database-table-column-new-dialog/database-table-column-new-dialog.component';
import { DatabaseTableColumnDeleteDialogComponent } from '../database-table-column-delete-dialog/database-table-column-delete-dialog.component';

@Component({
  selector: 'app-database-table-columns',
  templateUrl: './database-table-columns.component.html',
  styleUrl: './database-table-columns.component.css',
})
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
  }

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
          .subscribe((createColumnResponse) => {
            if (
              createColumnResponse.status === 'error' &&
              'message' in createColumnResponse
            ) {
              console.error(createColumnResponse);
              return;
            }

            this.databaseService
              .getColumns(result.databaseName, result.tableName)
              .subscribe((response) => {
                this.columns = response.data;
              });
          });
      }
    });
  }

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
          .subscribe((deleteColumnResponse) => {
            if (
              deleteColumnResponse.status === 'error' &&
              'message' in deleteColumnResponse
            ) {
              console.error(deleteColumnResponse);
              return;
            }

            this.databaseService
              .getColumns(databaseName, tableName)
              .subscribe((response) => {
                this.columns = response.data;
              });
          });
      }
    });
  }
}
