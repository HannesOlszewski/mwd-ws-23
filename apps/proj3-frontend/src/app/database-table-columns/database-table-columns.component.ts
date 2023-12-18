import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ApiEvent, Column, DatabaseService } from '../database.service';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseTableColumnNewDialogComponent } from '../database-table-column-new-dialog/database-table-column-new-dialog.component';
import { DatabaseTableColumnDeleteDialogComponent } from '../database-table-column-delete-dialog/database-table-column-delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-database-table-columns',
  templateUrl: './database-table-columns.component.html',
  styleUrl: './database-table-columns.component.css',
})
/**
 * Represents a component that displays the columns of a database table.
 */
export class DatabaseTableColumnsComponent implements AfterViewInit {
  databaseName?: string;
  tableName?: string;
  dataSource = new MatTableDataSource<Column>([]);
  displayedTableColumns: string[] = [
    'name',
    'type',
    'nullable',
    'primaryKey',
    'unique',
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
  }

  @Input()
  set table(table: string) {
    this.tableName = table;
  }

  private setColumns(columns: Column[]) {
    this.dataSource.data = columns;
  }

  ngAfterViewInit(): void {
    if (!this.databaseName || !this.tableName) {
      throw new Error('Database name or table name not provided.');
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.databaseService
      .getColumns(this.databaseName, this.tableName)
      .subscribe((response) => {
        if (response.status !== 'ok') {
          return;
        }

        this.setColumns(response.data);
      });

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (parsedData.type === 'add-column') {
        this.setColumns([...this.dataSource.data, parsedData.column]);
      } else if (parsedData.type === 'delete-column') {
        this.setColumns(
          this.dataSource.data.filter(
            (column) => column.name !== parsedData.column,
          ),
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
