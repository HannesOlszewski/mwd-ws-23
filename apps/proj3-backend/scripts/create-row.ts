import { DatabaseFactory } from "../src/database/factory";

if (process.argv.length < 4) {
  console.error(
    "Usage: ts-node create-row.ts <database name> <table name> [<data column 1> <data column 2> ... <data column N>]",
  );
  process.exit(1);
}

const databaseName = process.argv[2];
const tableName = process.argv[3];
const dataColumns = process.argv.slice(4);

async function createRow(
  database: string,
  table: string,
  data: string[],
): Promise<void> {
  const factory = new DatabaseFactory("sqlite");
  const connection = await factory.createDatabase({ database });
  const columns = await connection.getColumns(table);
  const row: Record<string, unknown> = {};
  for (let i = 1; i < columns.length; i++) {
    row[columns[i].name] = data[i - 1];
  }
  await connection.addRow(table, row);
  await connection.closeConnection();
}

createRow(databaseName, tableName, dataColumns)
  .then(() => {
    console.log(
      `Created row in table ${tableName} in database ${databaseName}`,
    );
  })
  .catch((error) => {
    console.error(error);
  });
