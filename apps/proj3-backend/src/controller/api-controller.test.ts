import fs from "node:fs";
import type { Column } from "types";
import { ApiController } from "./api-controller";

describe("ApiController", () => {
  let apiController: ApiController;

  beforeEach(() => {
    apiController = new ApiController();

    if (!fs.existsSync("./databases")) {
      fs.mkdirSync("./databases");
    }
  });

  afterEach(async () => {
    await apiController.close();

    if (fs.existsSync("./databases/test-db.db")) {
      fs.unlinkSync("./databases/test-db.db");
    }
  });

  it("should create an instance", () => {
    expect(apiController).toBeTruthy();
  });

  it("should retrieve available databases", async () => {
    const databases = await apiController.getAvailableDatabases();
    const availableDatabases = fs
      .readdirSync("./databases")
      .map((file) => file.replace(".db", ""));

    expect(databases).toEqual(availableDatabases);
  });

  it("should retrieve schemas", async () => {
    const options = { database: "test-db" };
    const schemas = await apiController.getSchemas(options);

    expect(schemas).toEqual([]);
  });

  it("should retrieve tables", async () => {
    const options = { database: "test-db" };
    const idColumn: Column = { name: "id", type: "INTEGER", primaryKey: true };
    await apiController.createTable(options, "users", [idColumn]);

    const tables = await apiController.getTables(options);

    expect(tables).toEqual(expect.arrayContaining(["users"]));
  });

  it("should create a table", async () => {
    const options = { database: "test-db" };
    const name = "new_table";
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true },
    ];
    await apiController.createTable(options, name, columns);
    const tables = await apiController.getTables(options);

    expect(tables).toEqual(expect.arrayContaining([name]));
  });

  it("should delete a table", async () => {
    const options = { database: "test-db" };
    const name = "table_to_delete";
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true },
    ];
    await apiController.createTable(options, name, columns);
    await apiController.deleteTable(options, name);
    const tables = await apiController.getTables(options);

    expect(tables).not.toEqual(expect.arrayContaining([name]));
  });

  it("should retrieve columns", async () => {
    const options = { database: "test-db" };
    const columns: Column[] = [
      {
        name: "id",
        type: "INTEGER",
        nullable: false,
        primaryKey: true,
        unique: true,
      },
    ];
    await apiController.createTable(options, "users", columns);

    const actualColumns = await apiController.getColumns(options, "users");

    expect(actualColumns).toEqual(expect.arrayContaining(columns));
  });

  it("should add a column", async () => {
    const options = { database: "test-db" };
    const idColumn: Column = { name: "id", type: "INTEGER", primaryKey: true };
    await apiController.createTable(options, "users", [idColumn]);

    const column: Column = {
      name: "email",
      type: "TEXT",
      nullable: false,
      primaryKey: false,
      unique: false,
    };
    await apiController.addColumn(options, "users", column);
    const columns = await apiController.getColumns(options, "users");

    expect(columns).toEqual(expect.arrayContaining([column]));
  });

  it("should delete a column", async () => {
    const options = { database: "test-db" };
    const idColumn: Column = { name: "id", type: "INTEGER", primaryKey: true };
    const emailColumn: Column = {
      name: "email",
      type: "TEXT",
      nullable: false,
      primaryKey: false,
      unique: false,
    };
    await apiController.createTable(options, "users", [idColumn, emailColumn]);

    await apiController.deleteColumn(options, "users", "email");
    const columns = await apiController.getColumns(options, "users");

    expect(columns).not.toEqual(expect.arrayContaining([{ name: "users" }]));
    expect(columns).toHaveLength(1);
    expect(columns[0].name).toEqual("id");
  });

  // TODO: Use this when we have a way to insert rows into a table.
  // it("should retrieve rows", async () => {
  //   const options = { database: "test-db" };
  //   // TODO: Add a way to insert rows into a table.
  //   const rows = await apiController.getRows(options, "users");

  //   expect(rows).toEqual(expect.arrayContaining([{ id: 1, name: "John" }]));
  // });
});
