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
export class DatabaseTableRowEditDialogComponent {
  row: Row = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.row = data.row;
  }

  onFieldChange(event: any, column: Column) {
    this.row[column.name] = event.target.value;
  }

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

  getColumnsToDisplay() {
    return this.data.columns.filter((column) => !column.primaryKey);
  }

  isFormValid() {
    return Object.keys(this.row).every((key) => {
      return (
        this.row[key] !== '' ||
        this.data.columns.find((column) => column.name === key)?.nullable
      );
    });
  }

  getResult() {
    return {
      databaseName: this.data.databaseName,
      tableName: this.data.tableName,
      row: this.row,
    };
  }
}
