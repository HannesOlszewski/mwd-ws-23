import http from "node:http";
import WebSocket from "ws";

const PORT = process.env.PORT ?? 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Chat Server Running");
});

const wss = new WebSocket.Server({ server });

let clients: WebSocket[] = [];

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  clients.push(ws);

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);

    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
