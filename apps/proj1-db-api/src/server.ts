import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";

import WebSocket from "ws";
import http from "node:http";

import { ReadlineService } from "./utils/readline-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();
const readlineService = new ReadlineService();
const websocketServer = new WebSocket.Server({ port: 8080 });

readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

  websocketServer.on(
    "connection",
    (ws: WebSocket, _request: http.IncomingMessage, client: string) => {
      console.log(`${client} connected`);
  
      ws.on("message", (message: string) => {
        console.log("Received message from user: ${message}");
        databaseUtils.jsonQuery(database, message);
      });
  
      ws.on("close", () => {
        console.log("user disconnected");
      });
    }
  );