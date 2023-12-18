import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  databaseName: string;
}

@Component({
  selector: 'app-database-delete-dialog',
  templateUrl: './database-delete-dialog.component.html',
  styleUrl: './database-delete-dialog.component.css',
})
export class DatabaseDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
