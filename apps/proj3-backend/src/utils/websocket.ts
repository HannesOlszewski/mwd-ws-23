import type WebSocket from "ws";

/**
 * Broadcasts a message to multiple WebSocket clients.
 *
 * @param message - The message to be broadcasted.
 * @param webSocketClients - An array of WebSocket clients.
 */
export function broadcast<T extends object>(
  message: string | T,
  webSocketClients: WebSocket[]
): void {
  let stringifyedMessage: string;

  if (typeof message === "object") {
    stringifyedMessage = JSON.stringify(message);
  } else {
    stringifyedMessage = message;
  }

  webSocketClients.forEach((ws) => {
    ws.send(stringifyedMessage);
  });
}
