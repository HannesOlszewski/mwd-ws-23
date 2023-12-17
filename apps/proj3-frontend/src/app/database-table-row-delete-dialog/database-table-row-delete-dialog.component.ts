import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Row } from '../database.service';

export interface DialogData {
  databaseName: string;
  tableName: string;
  row: Row;
}

@Component({
  selector: 'app-database-table-row-delete-dialog',
  templateUrl: './database-table-row-delete-dialog.component.html',
  styleUrl: './database-table-row-delete-dialog.component.css',
})
/**
 * Represents a dialog component for deleting a row in a database table.
 */
export class DatabaseTableRowDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  /**
   * Retrieves the columns to display for the row being deleted.
   * @returns An array of column names.
   */
  getColumnsToDisplay() {
    return Object.keys(this.data.row);
  }
}
