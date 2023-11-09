export interface Column {
  name: string;
  type?: "TEXT" | "INTEGER" | "REAL" | "BLOB";
  nullable?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
}

export interface Table {
  name: string;
  columns: Column[];
}

// TODO: go through phpMyAdmin and see what actions should be possible
export interface Database {
  initialize: () => Promise<void>;
  createTable: (name: string, columns: Column[]) => Promise<Table>;
  select: (
    columns: string[],
    from: string,
    where: string,
  ) => Promise<unknown[]>;
  insert: (table: string, values: object) => Promise<number>;
  update: (table: string, values: object, where: string) => Promise<number>;
  delete: (table: string, where: string) => Promise<number>;
  close: () => Promise<void>;
}
