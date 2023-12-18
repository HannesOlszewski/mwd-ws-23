export const routes = {
  databases: "/databases",
  schemas: "/databases/:name/schemas",
  tables: "/databases/:databaseName/schemas/:schemaName/tables",
  columns:
    "/databases/:databaseName/schemas/:schemaName/tables/:tableName/columns",
  rows: "/databases/:databaseName/schemas/:schemaName/tables/:tableName/rows",
  apiEvents: "/ws",
} as const;
