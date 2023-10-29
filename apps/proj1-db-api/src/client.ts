import WebSocket from "ws";
import fs from "fs";

import { ReadlineService } from "./utils/readline-utils";

const demo_create_table: string = fs.readFileSync("json/create_table.json").toString();

const SERVER_HOST = process.env.SERVER_HOST ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? 8080;
const USE_TLS = process.env.USE_TLS === "true";
const API_URL = `ws://${SERVER_HOST}:${SERVER_PORT}`;

const readlineService: ReadlineService = new ReadlineService();
readlineService.closeOnCtrlC();
readlineService.exitProcessOnClose();

const websocket = new WebSocket(`${API_URL}`, {
    perMessageDeflate: false,
  });

  const rl = readlineService.readlineInterface();

  websocket.on("open", () => {
    console.log("Connected to the API websocket.");
    websocket.send(demo_create_table);
  });

  websocket.on("close", () => {
    console.log("Disconnected from the API websocket.");
    rl.close();
  });

  websocket.on("error", (error: Error) => {
    console.error(`Error: ${error.message}`);
    rl.close();
  });