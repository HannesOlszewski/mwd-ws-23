import WebSocket from "ws";
import type { Message } from "../shared/types";
import { ReadlineService } from "../shared/readline-utils";
import { login } from "./http-utils";

const SERVER_HOST = process.env.SERVER_HOST ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? 8080;
const USE_TLS = process.env.USE_TLS === "true";
const SERVER_URL = `http${USE_TLS ? "s" : ""}://${SERVER_HOST}:${SERVER_PORT}`;
const CHAT_URL = `ws${USE_TLS ? "s" : ""}://${SERVER_HOST}:${SERVER_PORT}/chat`;

const readlineService: ReadlineService = new ReadlineService();
readlineService.closeOnCtrlC();
readlineService.exitProcessOnClose();

/**
 * Starts a chat session with the server using the provided authentication token.
 * @param authToken - The authentication token to use for the chat session.
 * @returns void
 */
function startChat(authToken: string): void {
  console.log("Connecting to the chat server...");
  const ws = new WebSocket(`${CHAT_URL}?token=${authToken}`, {
    perMessageDeflate: false,
  });

  const rl = readlineService.readlineInterface();

  ws.on("open", () => {
    console.log("Connected to the chat server");

    rl.prompt();

    rl.on("line", (line) => {
      if (line === "\\q") {
        rl.close();
      }

      ws.send(line);
      rl.prompt();
    });
  });

  ws.on("message", (message: string) => {
    const data: Message = JSON.parse(message) as Message;

    if (data.from !== undefined) {
      console.log(`${data.from}: ${data.message}`);
    } else {
      console.log(data.message);
    }

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
}

/**
 * The main function that starts the chat client.
 * Prompts the user for a username and password, logs in to the server,
 * and starts the chat using the authentication token.
 */
async function main(): Promise<void> {
  const username = await readlineService.question("Username: ");
  readlineService.maskOutput();
  const password = await readlineService.question("Password: ");
  readlineService.unmaskOutput();

  const authToken = await login(SERVER_URL, username, password);
  startChat(authToken);
}

// Actually execute the main client program
main().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
  }

  process.exit(1);
});
