import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  databaseName: string;
}

@Component({
  selector: 'app-database-table-new-dialog',
  templateUrl: './database-table-new-dialog.component.html',
  styleUrl: './database-table-new-dialog.component.css',
})
/**
 * Represents a dialog component for creating a new database table.
 */
export class DatabaseTableNewDialogComponent {
  tableName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  /**
   * Gets the result of the dialog.
   * @returns An object containing the database name and table name.
   */
  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.tableName,
    };
  }
}
