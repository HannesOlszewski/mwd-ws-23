import { DatabaseFactory } from "../src/database/factory";

if (process.argv.length < 4) {
  console.error("Usage: ts-node create-table.ts <database name> <table name>");
  process.exit(1);
}

const databaseName = process.argv[2];
const tableName = process.argv[3];

async function createTable(database: string, table: string): Promise<void> {
  const factory = new DatabaseFactory("sqlite");
  const connection = await factory.createDatabase({ database });
  await connection.createTable(table, [
    {
      name: "id",
      type: "INTEGER",
      nullable: false,
      primaryKey: true,
      unique: true,
    },
  ]);
  await connection.closeConnection();
}

createTable(databaseName, tableName)
  .then(() => {
    console.log(`Created table ${tableName} in database ${databaseName}`);
  })
  .catch((error) => {
    console.error(error);
  });
