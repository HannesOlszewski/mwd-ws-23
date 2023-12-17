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
/**
 * Represents a dialog component for creating a new database table column.
 */
export class DatabaseTableColumnNewDialogComponent {
  columnName: string = '';
  columnType: 'INTEGER' | 'TEXT' = 'TEXT';
  isNullable: boolean = true;
  isPrimaryKey: boolean = false;
  isUnique: boolean = false;
  readonly types: ('INTEGER' | 'TEXT')[] = ['INTEGER', 'TEXT'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  /**
   * Handles the change event when the column type is selected.
   * @param event - The change event object.
   */
  onTypeChange(event: any) {
    this.columnType = event.value;
  }

  /**
   * Gets the result of the dialog.
   * @returns An object containing the database name, table name, column name, column type, nullable flag, primary key flag, and unique flag.
   */
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
