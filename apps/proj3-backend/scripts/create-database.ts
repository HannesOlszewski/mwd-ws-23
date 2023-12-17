import { DatabaseFactory } from "../src/database/factory";

if (process.argv.length < 3) {
  console.error("Usage: ts-node create-database.ts <database name>");
  process.exit(1);
}

const databaseName = process.argv[2];

async function createDatabase(database: string): Promise<void> {
  const factory = new DatabaseFactory("sqlite");
  const connection = await factory.createDatabase({ database });
  await connection.closeConnection();
}

createDatabase(databaseName)
  .then(() => {
    console.log(`Created database ${databaseName}`);
  })
  .catch((error) => {
    console.error(error);
  });
