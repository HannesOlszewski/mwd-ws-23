import { Component } from '@angular/core';
import { ApiEvent, DatabaseService } from '../database.service';

@Component({
  selector: 'app-api-event-log',
  templateUrl: './api-event-log.component.html',
  styleUrl: './api-event-log.component.css',
})
export class ApiEventLogComponent {
  apiEvents: ApiEvent[] = [];

  constructor(private databaseService: DatabaseService) {
    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);
      this.apiEvents = [parsedData, ...this.apiEvents];
    });
  }
}
