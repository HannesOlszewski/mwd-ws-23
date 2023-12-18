import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ApiEvent, DatabaseService, Table } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableNewDialogComponent } from '../database-table-new-dialog/database-table-new-dialog.component';
import { DatabaseTableDeleteDialogComponent } from '../database-table-delete-dialog/database-table-delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-database-tables',
  templateUrl: './database-tables.component.html',
  styleUrl: './database-tables.component.css',
})
/**
 * Represents a component that displays the tables of a database.
 */
export class DatabaseTablesComponent implements AfterViewInit {
  databaseName?: string;
  dataSource: MatTableDataSource<Table> = new MatTableDataSource<Table>([]);
  displayedTableColumns: string[] = [
    'name',
    'numColumns',
    'numRows',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
  ) {}

  @Input()
  set database(database: string) {
    this.databaseName = database;

    this.databaseService.getTables(database).subscribe((response) => {
      if (response.status !== 'ok') {
        return;
      }

      this.setTables(response.data);
    });

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (parsedData.type === 'add-table') {
        const tables = [
          ...this.dataSource.data,
          { name: parsedData.table, numColumns: 1, numRows: 0 },
        ];

        this.setTables(tables);
      } else if (parsedData.type === 'delete-table') {
        const tables = this.dataSource.data.filter(
          (table) => table.name !== parsedData.table,
        );

        this.setTables(tables);
      }
    });
  }

  private setTables(tables: Table[]) {
    this.dataSource.data = tables;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Opens a dialog for creating a new database table.
   */
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
          .subscribe();
      }
    });
  }

  /**
   * Opens a dialog to delete a table from the database.
   *
   * @param table - The name of the table to delete.
   */
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
        this.databaseService.deleteTable(databaseName, table).subscribe();
      }
    });
  }
}
