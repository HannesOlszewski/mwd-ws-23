import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'proj3-frontend';
  databases: string[] = [];

  constructor(private databaseService: DatabaseService, private router: Router) {}

  getDatabases(): void {
    this.databaseService
      .getDatabases()
      .subscribe((databases) => (this.databases = databases.data));
  }

  ngOnInit(): void {
    this.getDatabases();
  }

  isActiveDatabase(database: string): boolean {
    return this.router.url.startsWith(`/databases/${database}`);
  }
}
