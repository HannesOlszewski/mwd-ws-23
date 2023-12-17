import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column, Row } from '../database.service';

export interface DialogData {
  databaseName: string;
  tableName: string;
  columns: Column[];
}

@Component({
  selector: 'app-database-table-row-new-dialog',
  templateUrl: './database-table-row-new-dialog.component.html',
  styleUrl: './database-table-row-new-dialog.component.css',
})
/**
 * Represents a dialog component for creating a new row in a database table.
 */
export class DatabaseTableRowNewDialogComponent {
  row: Row = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.columns.forEach((column) => {
      if (column.primaryKey) {
        return;
      }

      switch (column.type) {
        case 'INTEGER':
          this.row[column.name] = 0;
          break;
        case 'TEXT':
          this.row[column.name] = '';
          break;
      }
    });
  }

  /**
   * Handles the change event of a field in the database table row new dialog.
   * Updates the value of the specified column in the row object.
   *
   * @param event - The change event object.
   * @param column - The column object representing the field being changed.
   */
  onFieldChange(event: any, column: Column) {
    this.row[column.name] = event.target.value;
  }

  /**
   * Returns the input type based on the column type.
   * @param column The column object.
   * @returns The input type as a string.
   */
  getInputType(column: Column) {
    switch (column.type) {
      case 'INTEGER':
        return 'number';
      case 'TEXT':
        return 'text';
      default:
        return 'text';
    }
  }

  /**
   * Returns an array of columns to display in the table row new dialog.
   * Filters out columns that are marked as primary keys.
   *
   * @returns {Column[]} An array of columns to display.
   */
  getColumnsToDisplay(): Column[] {
    return this.data.columns.filter((column) => !column.primaryKey);
  }

  /**
   * Checks if the form is valid.
   * The form is considered valid if all non-nullable fields are filled.
   * Nullable fields are allowed to be empty.
   *
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  isFormValid(): boolean {
    return Object.keys(this.row).every((key) => {
      return (
        this.row[key] !== '' ||
        this.data.columns.find((column) => column.name === key)?.nullable
      );
    });
  }

  /**
   * Retrieves the result of the database table row new dialog.
   * @returns An object containing the database name, table name, and row data.
   */
  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.data.tableName,
      row: this.row,
    };
  }
}
