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
