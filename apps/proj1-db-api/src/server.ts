import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";

import WebSocket, { WebSocketServer } from "ws";
import http from "node:http";

import { ReadlineService } from "./utils/readline-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();
const readlineService = new ReadlineService();

const use_express: boolean = true;

readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

if (use_express) {
    var express = require('express');
    var app = express();
    var expressWs = require('express-ws')(app);
    var router = express.Router();

    app.ws('/', function(ws: WebSocket, req: http.IncomingMessage) {
        ws.on('message', function(message: string) {
            console.log("Received message from user: ${message}");
            databaseUtils.jsonQuery(database, message);
        });
      });

      app.listen(8080);
} else {
    var websocketServer = new WebSocket.Server({ port: 8080 });

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
}

