import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-databases',
  templateUrl: './databases.component.html',
  styleUrl: './databases.component.css',
})
/**
 * Represents the DatabasesComponent class.
 */
export class DatabasesComponent implements OnInit {
  databases: string[] = [];
  displayedTableColumns: string[] = ['name'];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.databaseService.getDatabases().subscribe((response) => {
      if (response.status !== 'ok') {
        return;
      }

      this.databases = response.data;
    });
  }
}
