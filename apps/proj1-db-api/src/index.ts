import { getDb } from "./persistence";

async function main(): Promise<void> {
  console.log("Connecting to database...");
  const db = await getDb();
  console.log("Database ready!");

  console.log("Creating table...");
  const table = await db.createTable("users", [
    { name: "id", type: "INTEGER", primaryKey: true, unique: true },
    { name: "name", type: "TEXT" },
  ]);
  console.log("Table created!", table);

  console.log("Inserting row...");
  const id = await db.insert("users", { name: "John Doe" });
  console.log("Row inserted!", id);

  console.log("Selecting rows...");
  const rows = await db.select(["id", "name"], "users", `id = ${id}`);
  console.log("Rows selected!", rows);

  console.log("Updating row...");
  const updated = await db.update("users", { name: "Jane Doe" }, `id = ${id}`);
  console.log("Row updated!", updated);

  console.log("Deleting row...");
  const deleted = await db.delete("users", `id = ${id}`);
  console.log("Row deleted!", deleted);

  console.log("Closing database connection...");
  await db.close();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
