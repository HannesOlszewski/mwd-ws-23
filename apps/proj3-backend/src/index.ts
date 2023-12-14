import express, { json } from "express";
import type { Column, ColumnType } from "types";
import { routes } from "types";
import { Logger } from "./utils/logger";
import { ApiController } from "./controller/api-controller";
import { errorMessage, successMessage } from "./utils/response";
import {
  parseRequestParams,
  parseRequestData,
  parseRequestQuery,
} from "./utils/request";

const app = express();
app.use(json());
const port = 3000;
const logger = new Logger("app");
const apiController = new ApiController();

app.get("/", (req, res) => {
  res.send(successMessage());
});

app.get(routes.databases, (req, res) => {
  apiController
    .getAvailableDatabases()
    .then((databases) => {
      res.send(successMessage(databases));
    })
    .catch((error) => {
      logger.error(`Error getting available databases: ${error}`);
      res.status(500).send(errorMessage("Error getting available databases"));
    });
});

app.get(routes.schemas, (req, res) => {
  const { name } = parseRequestParams<{ name: string }>(req);

  apiController
    .getSchemas({ database: name })
    .then((schemas) => {
      res.send(successMessage(schemas));
    })
    .catch((error) => {
      logger.error(`Error getting schemas: ${error}`);
      res.status(500).send(errorMessage("Error getting schemas"));
    });
});

app.get(routes.tables, (req, res) => {
  // TODO: add schema support
  const { databaseName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
  }>(req);

  apiController
    .getTables({ database: databaseName })
    .then((tables) => {
      res.send(successMessage(tables));
    })
    .catch((error) => {
      logger.error(`Error getting tables: ${error}`);
      res.status(500).send(errorMessage("Error getting tables"));
    });
});

app.post(routes.tables, (req, res) => {
  // TODO: add schema support
  const { databaseName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
  }>(req);
  const { name, columns } = parseRequestData<{
    name: string;
    columns: Column[];
  }>(req);

  apiController
    .createTable({ database: databaseName }, name, columns)
    .then(() => {
      res.send(successMessage());
    })
    .catch((error) => {
      logger.error(`Error creating table: ${error}`);
      res.status(500).send(errorMessage("Error creating table"));
    });
});

app.delete(routes.tables, (req, res) => {
  // TODO: add schema support
  const { databaseName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
  }>(req);
  const { name, columns } = parseRequestData<{
    name: string;
    columns: Column[];
  }>(req);

  apiController
    .createTable({ database: databaseName }, name, columns)
    .then(() => {
      res.send(successMessage());
    })
    .catch((error) => {
      logger.error(`Error creating table: ${error}`);
      res.status(500).send(errorMessage("Error creating table"));
    });
});

app.get(routes.columns, (req, res) => {
  // TODO: add schema support
  const { databaseName, tableName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
    tableName: string;
  }>(req);

  apiController
    .getColumns({ database: databaseName }, tableName)
    .then((columns) => {
      res.send(successMessage(columns));
    })
    .catch((error) => {
      logger.error(`Error getting columns: ${error}`);
      res.status(500).send(errorMessage("Error getting columns"));
    });
});

app.post(routes.columns, (req, res) => {
  // TODO: add schema support
  const { databaseName, tableName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
    tableName: string;
  }>(req);
  const { name, type, nullable, primaryKey, unique } = parseRequestData<{
    name: string;
    type: ColumnType;
    nullable?: boolean;
    primaryKey?: boolean;
    unique?: boolean;
  }>(req);

  apiController
    .addColumn({ database: databaseName }, tableName, {
      name,
      type,
      nullable,
      primaryKey,
      unique,
    })
    .then(() => {
      res.send(successMessage());
    })
    .catch((error) => {
      logger.error(`Error adding column: ${error}`);
      res.status(500).send(errorMessage("Error adding column"));
    });
});

app.delete(routes.columns, (req, res) => {
  // TODO: add schema support
  const { databaseName, tableName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
    tableName: string;
  }>(req);
  const { name } = parseRequestData<{ name: string }>(req);

  apiController
    .deleteColumn({ database: databaseName }, tableName, name)
    .then(() => {
      res.send(successMessage());
    })
    .catch((error) => {
      logger.error(`Error deleting column: ${error}`);
      res.status(500).send(errorMessage("Error deleting column"));
    });
});

app.get(routes.rows, (req, res) => {
  // TODO: add schema support
  const { databaseName, tableName } = parseRequestParams<{
    databaseName: string;
    schemaName: string;
    tableName: string;
  }>(req);
  const { limit, offset, where, orderBy } = parseRequestQuery<{
    limit?: number;
    offset?: number;
    where?: string;
    orderBy?: Record<string, "ASC" | "DESC">;
  }>(req);

  apiController
    .getRows(
      { database: databaseName },
      tableName,
      limit,
      offset,
      where,
      orderBy
    )
    .then((rows) => {
      res.send(successMessage(rows));
    })
    .catch((error) => {
      logger.error(`Error getting rows: ${error}`);
      res.status(500).send(errorMessage("Error getting rows"));
    });
});

const server = app.listen(port, () => {
  logger.log(`Listening on port ${port}`);
});

server.on("SIGTERM", () => {
  logger.log("Received SIGTERM, closing server");

  server.close(() => {
    apiController.close().catch((error) => {
      logger.error(`Error closing api controller: ${error}`);
    });
  });
});
