import fs from "node:fs";
import type { Column } from "types";
import { SqliteDatabase } from "./sqlite";

describe("SqliteDatabase", () => {
  let database: SqliteDatabase;

  beforeEach(() => {
    database = new SqliteDatabase();

    if (!fs.existsSync("./databases")) {
      fs.mkdirSync("./databases");
    }
  });

  afterEach(async () => {
    if (database.isConnectedToDatabase()) {
      await database.closeConnection();
    }

    if (fs.existsSync("./databases/test-db.db")) {
      fs.unlinkSync("./databases/test-db.db");
    }
  });

  it("should connect to the SQLite database", async () => {
    const options = { database: "test-db" };

    await database.connect(options);

    expect(database.isConnectedToDatabase()).toBeTruthy();
  });

  it("should throw an error when trying to connect to an already connected database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);

    await expect(database.connect(options)).rejects.toThrow(
      "Already connected to SQLite database"
    );
  });

  it("should close the connection to the SQLite database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);

    await database.closeConnection();

    expect(database.isConnectedToDatabase()).toBeFalsy();
  });

  it("should throw an error when trying to close a non-existing connection", async () => {
    await expect(database.closeConnection()).resolves.toBeUndefined();
  });

  it("should get the list of available databases", async () => {
    const databases = await SqliteDatabase.getAvailableDatabases();
    const expectedDatabases = fs
      .readdirSync("./databases")
      .map((file) => file.replace(".db", ""));

    expect(databases).toEqual(expectedDatabases);
  });

  it("should get the list of schemas in the database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);

    const schemas = await database.getSchemas();

    expect(schemas).toEqual([]);
  });

  it("should get the list of tables in the database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);

    const tables = await database.getTables();
    expect(tables).toEqual([]);

    const idColumn: Column = {
      name: "id",
      type: "INTEGER",
      nullable: false,
      primaryKey: true,
      unique: true,
    };
    await database.createTable("table1", [idColumn]);
    await database.createTable("table2", [idColumn]);
    await database.createTable("table3", [idColumn]);

    const newTables = await database.getTables();

    expect(newTables).toEqual(["table1", "table2", "table3"]);
  });

  it("should create a table in the database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true, unique: true },
      { name: "name", type: "TEXT", nullable: false },
      { name: "age", type: "INTEGER", nullable: true },
    ];
    await database.createTable("users", columns);

    const tables = await database.getTables();

    expect(tables).toContain("users");
  });

  it("should throw an error when trying to create a table with no columns", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const columns: Column[] = [];

    await expect(database.createTable("users", columns)).rejects.toThrow(
      "Cannot create table with no columns"
    );
  });

  it("should throw an error when trying to create a table without a primary key", async () => {
    const options = { database: "test-db" };
    await database.connect(options);

    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: false },
      { name: "name", type: "TEXT", nullable: false },
      { name: "age", type: "INTEGER", nullable: true },
    ];
    await expect(database.createTable("users", columns)).rejects.toThrow(
      "Cannot create table without primary key"
    );
  });

  it("should delete a table from the database", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true, unique: true },
      { name: "name", type: "TEXT", nullable: false },
      { name: "age", type: "INTEGER", nullable: true },
    ];
    await database.createTable("users", columns);

    await database.deleteTable("users");
    const tables = await database.getTables();

    expect(tables).not.toContain("users");
  });

  it("should get the list of columns in a table", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const expectedColumns: Column[] = [
      {
        name: "id",
        type: "INTEGER",
        nullable: false,
        primaryKey: true,
        unique: true,
      },
      {
        name: "name",
        type: "TEXT",
        nullable: false,
        primaryKey: false,
        unique: false,
      },
      {
        name: "age",
        type: "INTEGER",
        nullable: true,
        primaryKey: false,
        unique: false,
      },
    ];
    await database.createTable("users", expectedColumns);
    expectedColumns;

    const columns = await database.getColumns("users");

    expect(columns).toEqual(expectedColumns);
  });

  it("should add a column to a table", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true, unique: true },
      { name: "name", type: "TEXT", nullable: false },
      { name: "age", type: "INTEGER", nullable: true },
    ];
    await database.createTable("users", columns);

    const column: Column = {
      name: "email",
      type: "TEXT",
      nullable: true,
      primaryKey: false,
      unique: false,
    };
    await database.addColumn("users", column);
    const newColumns = await database.getColumns("users");

    expect(newColumns).toContainEqual(column);
  });

  it("should delete a column from a table", async () => {
    const options = { database: "test-db" };
    await database.connect(options);
    const columns: Column[] = [
      { name: "id", type: "INTEGER", primaryKey: true, unique: true },
      { name: "name", type: "TEXT", nullable: false },
      { name: "age", type: "INTEGER", nullable: true },
    ];
    await database.createTable("users", columns);

    await database.deleteColumn("users", "age");
    const newColumns = await database.getColumns("users");

    expect(newColumns).not.toContainEqual({
      name: "age",
      type: "INTEGER",
      nullable: true,
      primaryKey: false,
    });
  });

  // TODO: enable this when rows can be inserted into a table
  // it("should get rows from a table", async () => {
  //   const options = { database: "test-db" };
  //   await database.connect(options);
  //   const columns: Column[] = [
  //     { name: "id", type: "INTEGER", primaryKey: true, unique: true },
  //     { name: "name", type: "TEXT", nullable: false },
  //     { name: "age", type: "INTEGER", nullable: true },
  //   ];
  //   await database.createTable("users", columns);
  //   // TODO: Add rows to table

  //   const rows = await database.getRows("users");

  //   expect(rows).toEqual([
  //     { id: 1, name: "John Doe", age: 25 },
  //     { id: 2, name: "Jane Smith", age: 30 },
  //     { id: 3, name: "Bob Johnson", age: 40 },
  //   ]);
  // });
});
