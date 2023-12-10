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

const openDatabaseConnections: Record<string, Database> = {};

app.get("/database/:name/connect", (req, res) => {
  const databaseName = req.params.name;

  databaseFactory
    .createDatabase({ database: databaseName })
    .then((database) => {
      openDatabaseConnections[databaseName] = database;
      res.send(`Connected to database ${databaseName}`);
    })
    .catch((error) => {
      logger.error(`Failed to connect to database ${databaseName}: ${error}`);
      res.send(`Failed to connect to database ${databaseName}: ${error}`);
    });
});

app.get("/database/:name/disconnect", (req, res) => {
  const databaseName = req.params.name;
  const database = Object.entries(openDatabaseConnections).find(
    ([name]) => name === databaseName,
  )?.[1];

  if (!database) {
    res.send(`No connection to database ${databaseName} to close`);
    return;
  }

  database
    .closeConnection()
    .then(() => {
      res.send(`Disconnected from database ${databaseName}`);
    })
    .catch((error) => {
      logger.error(
        `Failed to disconnect from database ${databaseName}: ${error}`,
      );
      res.send(`Failed to disconnect from database ${databaseName}: ${error}`);
    });
});

app.listen(port, () => {
  logger.log(`Listening on port ${port}`);
});
