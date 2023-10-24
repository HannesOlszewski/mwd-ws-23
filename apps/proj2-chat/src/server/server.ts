import http from "node:http";
import WebSocket from "ws";
import type { Message } from "../shared/types";
import { ReadlineService } from "../shared/readline-utils";
import { authenticate, handleLogin } from "./auth-utils";
import { ChatService } from "./chat-utils";

const readlineService = new ReadlineService();
readlineService.closeOnCtrlC("Shutting down...");
readlineService.exitProcessOnClose();

const PORT = process.env.PORT ?? 8080;

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

const chat: ChatService = new ChatService();

wss.on(
  "connection",
  (ws: WebSocket, _request: http.IncomingMessage, client: string) => {
    console.log(`${client} connected`);
    const connection = chat.addConnection({ username: client, websocket: ws });
    chat.broadcast({ message: `${connection.username} joined the chat` });

    ws.on("message", (message: string) => {
      console.log(`Received message from ${connection.username}: ${message}`);

      const messageToSend: Message = {
        from: connection.username,
        message: message.toString(),
      };
      chat.broadcast(messageToSend, [ws]);
    });

    ws.on("close", () => {
      console.log(`${connection.username} disconnected`);
      chat.broadcast({ message: `${connection.username} left the chat` });
      chat.removeConnection(connection);
    });
  }
);

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
