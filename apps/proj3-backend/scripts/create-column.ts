import type { ColumnType } from "types";
import { DatabaseFactory } from "../src/database/factory";

if (process.argv.length < 9) {
  console.error(
    "Usage: ts-node create-column.ts <database name> <table name> <column name> <column type> <column nullable> <column primary key> <column unique>"
  );
  process.exit(1);
}

const databaseName = process.argv[2];
const tableName = process.argv[3];
const columnName = process.argv[4];
const columnType = process.argv[5] as ColumnType;
const columnNullable: boolean = process.argv[6] === "true";
const columnPrimaryKey: boolean = process.argv[7] === "true";
const columnUnique: boolean = process.argv[8] === "true";

async function createColumn(
  database: string,
  table: string,
  column: string,
  type: ColumnType,
  nullable: boolean,
  primaryKey: boolean,
  unique: boolean
): Promise<void> {
  const factory = new DatabaseFactory("sqlite");
  const connection = await factory.createDatabase({ database });
  await connection.addColumn(table, {
    name: column,
    type,
    nullable,
    primaryKey,
    unique,
  });
  await connection.closeConnection();
}

createColumn(
  databaseName,
  tableName,
  columnName,
  columnType,
  columnNullable,
  columnPrimaryKey,
  columnUnique
)
  .then(() => {
    console.log(
      `Created column ${columnName} in table ${tableName} in database ${databaseName}`
    );
  })
  .catch((error) => {
    console.error(error);
  });
