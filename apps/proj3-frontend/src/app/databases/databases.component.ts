import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ApiEvent, DatabaseService } from '../database.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseNewDialogComponent } from '../database-new-dialog/database-new-dialog.component';
import { DatabaseDeleteDialogComponent } from '../database-delete-dialog/database-delete-dialog.component';

@Component({
  selector: 'app-databases',
  templateUrl: './databases.component.html',
  styleUrl: './databases.component.css',
})
/**
 * Represents the DatabasesComponent class.
 */
export class DatabasesComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<string>([]);
  displayedTableColumns: string[] = ['name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
  ) {}

  private setDatabases(databases: string[]) {
    this.dataSource.data = databases;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.databaseService.getDatabases().subscribe((response) => {
      if (response.status !== 'ok') {
        return;
      }

      this.setDatabases(response.data);
    });

    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);

      if (parsedData.type === 'add-database') {
        const databases = [...this.dataSource.data, parsedData.database];

        this.setDatabases(databases);
      } else if (parsedData.type === 'delete-database') {
        const databases = this.dataSource.data.filter(
          (database) => database !== parsedData.database,
        );

        this.setDatabases(databases);
      }
    });
  }

  openNewDatabaseDialog() {
    const dialogRef = this.dialog.open(DatabaseNewDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService.createDatabase(result.databaseName).subscribe();
      }
    });
  }

  openDeleteDatabaseDialog(database: string) {
    const dialogRef = this.dialog.open(DatabaseDeleteDialogComponent, {
      data: { databaseName: database },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.databaseService.deleteDatabase(database).subscribe();
      }
    });
  }
}
