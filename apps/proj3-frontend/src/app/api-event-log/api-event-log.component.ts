import { Component } from '@angular/core';
import { ApiEvent, DatabaseService } from '../database.service';

@Component({
  selector: 'app-api-event-log',
  templateUrl: './api-event-log.component.html',
  styleUrl: './api-event-log.component.css',
})
/**
 * Represents a component that displays a log of API events.
 */
export class ApiEventLogComponent {
  apiEvents: ApiEvent[] = [];

  constructor(private databaseService: DatabaseService) {
    this.databaseService.getApiEvents().subscribe(({ data }) => {
      const parsedData: ApiEvent = JSON.parse(data);
      this.apiEvents = [parsedData, ...this.apiEvents];
    });
  }

  getColumnName(event: ApiEvent): string {
    if (event.type === 'add-column' || event.type === 'delete-column') {
      return typeof event.column === 'string'
        ? event.column
        : event.column!.name;
    }

    return '';
  }
}
