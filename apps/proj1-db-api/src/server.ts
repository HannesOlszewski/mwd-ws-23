import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";

import fs from "fs";

import WebSocket from "ws";
import http from "node:http";

import { ReadlineService } from "./utils/readline-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();
const demo_create_table: string = fs.readFileSync("json/create_table.json").toString();
const readlineService = new ReadlineService();
const PORT = process.env.PORT ?? 8080;
const websocket = new WebSocket.Server({ noServer: true, path: "/api" });

readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

websocket.on(
    "connection",
    (ws: WebSocket, _request: http.IncomingMessage, client: string) => {
      console.log(`${client} connected`);
  
      ws.on("message", (message: string) => {
        console.log("Received message from user: ${message}");
        databaseUtils.jsonQuery(database, demo_create_table);
      });
  
      ws.on("close", () => {
        console.log("user disconnected");
      });
    }
  );