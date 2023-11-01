import { Database } from "sqlite3";
import { DatabaseUtils } from "./utils/database-utils";

import WebSocket, { WebSocketServer } from "ws";
import http from "node:http";

import { ReadlineService } from "./utils/readline-utils";

const database = new Database('assets/db.sqlite');
const databaseUtils = new DatabaseUtils();
const readlineService = new ReadlineService();

//const mode: string = "node.js";
const mode: string = "express.js";

readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

switch (mode) {
    case "node.js":
        var websocketServer = new WebSocket.Server({ port: 8080 });

        websocketServer.on(
            "connection",
            (ws: WebSocket, _request: http.IncomingMessage, client: string) => {
                console.log(`${client} connected`);

                ws.on("message", (message: string) => {
                    console.log("Received message from user.");
                    databaseUtils.jsonQuery(database, message);
                });

                ws.on("close", () => {
                    console.log("user disconnected");
                });
            }
        );
        break;
    case "express.js":
        var express = require('express');
        var app = express();

        //needed for some reason, even though the variables are never used...
        var expressWs = require('express-ws')(app);
        var router = express.Router();

        app.ws('/', function (ws: WebSocket, req: http.IncomingMessage) {
            ws.on('message', function (message: string) {
                console.log("Received message from user.");
                databaseUtils.jsonQuery(database, message);
            });
        });

        app.listen(8080);
        break;
    default:
        console.error("No framework selected.");
        break;
}

