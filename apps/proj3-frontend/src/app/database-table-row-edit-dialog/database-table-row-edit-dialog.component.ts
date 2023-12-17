import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column, Row } from '../database.service';

export interface DialogData {
  databaseName: string;
  tableName: string;
  columns: Column[];
  row: Row;
}

@Component({
  selector: 'app-database-table-row-edit-dialog',
  templateUrl: './database-table-row-edit-dialog.component.html',
  styleUrl: './database-table-row-edit-dialog.component.css',
})
/**
 * Represents a component for editing a row in a database table.
 */
export class DatabaseTableRowEditDialogComponent {
  row: Row = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.row = data.row;
  }

  /**
   * Handles the change event of a field in the database table row edit dialog.
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
   * @param column - The column object.
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
   * Returns an array of columns to display in the table row edit dialog.
   * Filters out columns that are marked as primary keys.
   *
   * @returns {Array<Column>} The columns to display.
   */
  getColumnsToDisplay(): Array<Column> {
    return this.data.columns.filter((column) => !column.primaryKey);
  }

  /**
   * Checks if the form is valid.
   * The form is considered valid if all non-nullable fields in the row are not empty,
   * or if a nullable field is empty but marked as nullable in the column definition.
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
   * Retrieves the result of the database table row edit dialog.
   * @returns An object containing the database name, table name, and row.
   */
  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.data.tableName,
      row: this.row,
    };
  }
}
