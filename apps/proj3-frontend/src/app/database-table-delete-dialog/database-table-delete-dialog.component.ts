import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  databaseName: string;
  tableName: string;
}

@Component({
  selector: 'app-database-table-delete-dialog',
  templateUrl: './database-table-delete-dialog.component.html',
  styleUrl: './database-table-delete-dialog.component.css',
})
export class DatabaseTableDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
