import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DatabaseService } from '../database.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
  displayedTableColumns: string[] = ['name'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private databaseService: DatabaseService) {}

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
  }
}
