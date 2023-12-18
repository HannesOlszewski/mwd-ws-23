import { DatabaseFactory } from "./factory";
import { SqliteDatabase } from "./sqlite";

describe("DatabaseFactory", () => {
  describe("createDatabase", () => {
    it("should create a new SqliteDatabase instance when the database type is 'sqlite'", async () => {
      const factory = new DatabaseFactory("sqlite");
      const options = { database: "test-db" };

      const database = await factory.getDatabase(options);

      expect(database).toBeInstanceOf(SqliteDatabase);
    });

    it("should throw an error when the database type is unknown", async () => {
      const factory = new DatabaseFactory("unknown" as unknown as "sqlite");
      const options = { database: "test-db" };

      await expect(factory.getDatabase(options)).rejects.toThrow(
        "Unknown database type",
      );
    });
  });

  describe("getAvailableDatabases", () => {
    it("should return the available databases from SqliteDatabase when the database type is 'sqlite'", async () => {
      const factory = new DatabaseFactory("sqlite");

      const databases = await factory.getAvailableDatabases();

      expect(databases).toEqual(await SqliteDatabase.getAvailableDatabases());
    });

    it("should throw an error when the database type is unknown", async () => {
      const factory = new DatabaseFactory("unknown" as unknown as "sqlite");

      await expect(factory.getAvailableDatabases()).rejects.toThrow(
        "Unknown database type",
      );
    });
  });
});
