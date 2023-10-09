import readline from "node:readline";
import WebSocket from "ws";
import type { Message } from "./server";

let muteStdOut = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdin.on("keypress", () => {
  if (muteStdOut) {
    const len = rl.line.length;

    readline.moveCursor(process.stdout, -len, 0, () => {
      readline.clearLine(process.stdout, 1, () => {
        for (let i = 0; i < len; i++) {
          process.stdout.write("*");
        }
      });
    });
  }
});

const SERVER_HOST = process.env.SERVER_HOST ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? 8080;
const USE_TLS = process.env.USE_TLS === "true";
const SERVER_URL = `http${USE_TLS ? "s" : ""}://${SERVER_HOST}:${SERVER_PORT}`;
const CHAT_URL = `ws${USE_TLS ? "s" : ""}://${SERVER_HOST}:${SERVER_PORT}/chat`;

rl.question("Username: ", (username) => {
  muteStdOut = true;
  rl.question("Password: ", (password) => {
    muteStdOut = false;
    login(username, password)
      .then(startChat)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        }

        process.exit(1);
      });
  });
});

interface LoginResponse {
  token: string;
}

async function login(username: string, password: string): Promise<string> {
  const response = await fetch(`${SERVER_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  console.log("Login successful");
  const data: LoginResponse = (await response.json()) as LoginResponse;

  return data.token;
}

function startChat(authToken: string): void {
  console.log("Connecting to the chat server...");
  const ws = new WebSocket(`${CHAT_URL}?token=${authToken}`, {
    perMessageDeflate: false,
  });

  rl.setPrompt("> ");

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

    rl.on("close", () => {
      ws.close();
      process.exit();
    });

    rl.on("SIGINT", () => {
      rl.close();
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
