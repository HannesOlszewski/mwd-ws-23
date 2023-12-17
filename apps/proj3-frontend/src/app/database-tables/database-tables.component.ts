import { Component, Input } from '@angular/core';
import { DatabaseService, Table } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableNewDialogComponent } from '../database-table-new-dialog/database-table-new-dialog.component';
import { DatabaseTableDeleteDialogComponent } from '../database-table-delete-dialog/database-table-delete-dialog.component';

@Component({
  selector: 'app-database-tables',
  templateUrl: './database-tables.component.html',
  styleUrl: './database-tables.component.css',
})
export class DatabaseTablesComponent {
  databaseName?: string;
  tables: Table[] = [];
  displayedTableColumns: string[] = [
    'name',
    'numColumns',
    'numRows',
    'actions',
  ];

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
  ) {}

  @Input()
  set database(database: string) {
    this.databaseName = database;
    this.databaseService.getTables(database).subscribe((response) => {
      this.tables = response.data;
    });
  }

  openNewTableDialog() {
    const dialogRef = this.dialog.open(DatabaseTableNewDialogComponent, {
      data: {
        databaseName: this.databaseName,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .createTable(result.databaseName, result.tableName)
          .subscribe((createTableResponse) => {
            if (
              createTableResponse.status === 'error' &&
              'message' in createTableResponse
            ) {
              console.error(createTableResponse);
              return;
            }

            this.databaseService
              .getTables(result.databaseName)
              .subscribe((response) => {
                this.tables = response.data;
              });
          });
      }
    });
  }

  openDeleteTableDialog(table: string) {
    if (!this.databaseName) {
      return;
    }

    const databaseName = this.databaseName;

    const dialogRef = this.dialog.open(DatabaseTableDeleteDialogComponent, {
      data: {
        databaseName,
        tableName: table,
      },
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService
          .deleteTable(databaseName, table)
          .subscribe((deleteTableResponse) => {
            if (
              deleteTableResponse.status === 'error' &&
              'message' in deleteTableResponse
            ) {
              console.error(deleteTableResponse);
              return;
            }

            this.databaseService
              .getTables(databaseName)
              .subscribe((response) => {
                this.tables = response.data;
              });
          });
      }
    });
  }
}
