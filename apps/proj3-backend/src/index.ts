import express from "express";
import type { Database } from "types";
import { Logger } from "./utils/logger";
import { DatabaseFactory } from "./database/factory";

const app = express();
const port = 3000;
const logger = new Logger("app");
const databaseFactory = new DatabaseFactory("sqlite");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * Represents a database connection.
 */
interface DatabaseConnection {
  /**
   * The name of the database.
   */
  name: string;
  /**
   * The database instance.
   */
  database: Database;
  /**
   * The date when the database was last accessed.
   */
  lastAccessed: Date;
}

const openDatabaseConnections: DatabaseConnection[] = [];

app.get("/database/:name/connect", (req, res) => {
  const databaseName = req.params.name;

  const activeDatabaseConnection = openDatabaseConnections.find(
    (connection) => connection.name === databaseName
  );

  if (activeDatabaseConnection) {
    activeDatabaseConnection.lastAccessed = new Date();
    res.send(`Already connected to database ${databaseName}`);
    return;
  }

  databaseFactory
    .createDatabase({ database: databaseName })
    .then((database) => {
      openDatabaseConnections.push({
        name: databaseName,
        database,
        lastAccessed: new Date(),
      });
      res.send(`Connected to database ${databaseName}`);
    })
    .catch((error) => {
      logger.error(`Failed to connect to database ${databaseName}: ${error}`);
      res.send(`Failed to connect to database ${databaseName}: ${error}`);
    });
});

app.get("/database/:name/disconnect", (req, res) => {
  const databaseName = req.params.name;
  const database = openDatabaseConnections.find(
    ({ name }) => name === databaseName
  )?.database;

  if (!database) {
    res.send(`No connection to database ${databaseName} to close`);
    return;
  }

  database
    .closeConnection()
    .then(() => {
      openDatabaseConnections.splice(
        openDatabaseConnections.findIndex(({ name }) => name === databaseName),
        1
      );
      res.send(`Disconnected from database ${databaseName}`);
    })
    .catch((error) => {
      logger.error(
        `Failed to disconnect from database ${databaseName}: ${error}`
      );
      res.send(`Failed to disconnect from database ${databaseName}: ${error}`);
    });
});

const server = app.listen(port, () => {
  logger.log(`Listening on port ${port}`);
});

server.on("close", () => {
  openDatabaseConnections.forEach(({ name, database }) => {
    database
      .closeConnection()
      .then(() => {
        logger.log(`Disconnected from database ${name}`);
      })
      .catch((error) => {
        logger.error(`Failed to disconnect from database ${name}: ${error}`);
      });
  });
});
