import readline from "node:readline";
import WebSocket from "ws";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SERVER_HOST = process.env.SERVER_HOST ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? 8080;
const USE_TLS = process.env.USE_TLS === "true";
const SERVER_URL = `ws${USE_TLS ? "s" : ""}://${SERVER_HOST}:${SERVER_PORT}`;

const ws = new WebSocket(SERVER_URL);

rl.setPrompt("> ");

ws.on("open", () => {
  console.log("Connected to the chat server");

  rl.prompt(false);
  rl.on("line", (line) => {
    if (line === "\\q") {
      rl.close();
    }

    ws.send(line);
    rl.prompt();
  });

  rl.on("close", () => {
    ws.close();
    process.exit();
  });

  rl.on("SIGINT", () => {
    rl.close();
  });
});

ws.on("message", (message: string) => {
  console.log(`Received: ${message}`);
  rl.prompt();
});

ws.on("close", () => {
  console.log("Disconnected from the chat server");
  rl.close();
});

ws.on("error", (error: Error) => {
  console.error(`Error: ${error.message}`);
  rl.close();
});
