import http from "node:http";
import readline from "node:readline";
import WebSocket from "ws";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", () => {
  console.log("Shutting down...");
  rl.close();
  process.exit(0);
});

const PORT = process.env.PORT ?? 8080;

// Super safe way to store user data. Maps usernames to plain text passwords. :)
const users: Record<string, string> = {
  admin: "admin",
  user: "user",
};

interface LoginData {
  username: string;
  password: string;
}

async function parseRequestDataAsJson<T extends object>(
  req: http.IncomingMessage
): Promise<T> {
  if (req.method !== "POST") {
    throw new Error("Invalid request method");
  }

  if (req.headers["content-type"] !== "application/json") {
    throw new Error("Invalid request content type");
  }

  const body = await new Promise<string>((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      resolve(data);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });

  return JSON.parse(body) as T;
}

async function handleLogin(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const data = await parseRequestDataAsJson<LoginData>(req);

  if (data.username in users && users[data.username] === data.password) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ token: data.username }));
  } else {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid username or password" }));
  }
}

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/login":
      handleLogin(req, res).catch((err) => {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end('{ "message": "Internal server error" }');
      });
      break;
    case "/register":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end('{ "message": "Registration successful" }');
      break;
    default:
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Chat Server Running");
      break;
  }
});

const wss = new WebSocket.Server({ noServer: true, path: "/chat" });

interface ChatConnection {
  username: string;
  websocket: WebSocket;
}

export interface Message {
  from?: string;
  message: string;
}

let connections: ChatConnection[] = [];

function broadcast(message: Message, clientsToIgnore: WebSocket[] = []): void {
  connections.forEach(({ websocket }) => {
    if (
      websocket.readyState === WebSocket.OPEN &&
      !clientsToIgnore.includes(websocket)
    ) {
      websocket.send(JSON.stringify(message));
    }
  });
}

wss.on(
  "connection",
  (ws: WebSocket, _request: http.IncomingMessage, client: string) => {
    console.log(`${client} connected`);
    connections.push({ username: client, websocket: ws });
    broadcast({ message: `${client} joined the chat` });

    ws.on("message", (message: string) => {
      const sender = connections.find((c) => c.websocket === ws)?.username;

      if (!sender) {
        return;
      }

      console.log(`Received message from ${sender}: ${message}`);

      const messageToSend: Message = {
        from: sender,
        message: message.toString(),
      };
      broadcast(messageToSend, [ws]);
    });

    ws.on("close", () => {
      console.log(`${client} disconnected`);
      broadcast({ message: `${client} left the chat` });
      connections = connections.filter((c) => c.websocket !== ws);
    });
  }
);

function authenticate(
  request: http.IncomingMessage,
  callback: (err: Error | null, client?: string) => void
): void {
  if (!request.url) {
    callback(new Error("Missing token"));
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get("token");
  const isValidToken = token && token in users;

  if (isValidToken) {
    callback(null, token);
  } else {
    callback(new Error("Missing or invalid token"));
  }
}

server.on("upgrade", function upgrade(request, socket, head) {
  socket.on("error", console.error);

  authenticate(request, function next(err, client) {
    if (err || !client) {
      console.error(err);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    socket.removeListener("error", console.error);

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request, client);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
