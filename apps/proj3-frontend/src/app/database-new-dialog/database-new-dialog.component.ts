import { Component } from '@angular/core';

@Component({
  selector: 'app-database-new-dialog',
  templateUrl: './database-new-dialog.component.html',
  styleUrl: './database-new-dialog.component.css',
})
/**
 * Represents a dialog component for creating a new database.
 */
export class DatabaseNewDialogComponent {
  databaseName: string = '';

  /**
   * Gets the result of the dialog.
   * @returns An object containing the database name.
   */
  getResult() {
    return {
      databaseName: this.databaseName,
    };
  }
}
