import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  databaseName: string;
  tableName: string;
  columnName: string;
}

@Component({
  selector: 'app-database-table-column-delete-dialog',
  templateUrl: './database-table-column-delete-dialog.component.html',
  styleUrl: './database-table-column-delete-dialog.component.css',
})
/**
 * Represents a dialog component for deleting a database table column.
 */
export class DatabaseTableColumnDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
