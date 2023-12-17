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
export class DatabaseTableNewDialogComponent {
  tableName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.tableName,
    };
  }
}
