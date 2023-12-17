import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  databaseName: string;
  tableName: string;
}

@Component({
  selector: 'app-database-table-column-new-dialog',
  templateUrl: './database-table-column-new-dialog.component.html',
  styleUrl: './database-table-column-new-dialog.component.css',
})
export class DatabaseTableColumnNewDialogComponent {
  columnName: string = '';
  columnType: 'INTEGER' | 'TEXT' = 'TEXT';
  isNullable: boolean = true;
  isPrimaryKey: boolean = false;
  isUnique: boolean = false;
  readonly types: ('INTEGER' | 'TEXT')[] = ['INTEGER', 'TEXT'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onTypeChange(event: any) {
    this.columnType = event.value;
  }

  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.data.tableName,
      columnName: this.columnName,
      columnType: this.columnType,
      isNullable: this.isNullable,
      isPrimaryKey: this.isPrimaryKey,
      isUnique: this.isUnique,
    };
  }
}
