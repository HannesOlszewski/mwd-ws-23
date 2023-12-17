import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'proj3-frontend';
  databases: string[] = [];

  constructor(private databaseService: DatabaseService) {}

  getDatabases(): void {
    this.databaseService
      .getDatabases()
      .subscribe((databases) => (this.databases = databases.data));
  }

  ngOnInit(): void {
    this.getDatabases();
  }
}
