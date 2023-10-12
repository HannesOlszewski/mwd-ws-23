import { WebSocket } from "ws";
import type { ChatConnection, Message } from "../shared/types";

/**
 * Represents a chat service that manages WebSocket connections and broadcasts messages to clients.
 */
export class ChatService {
  private connections: ChatConnection[] = [];

  /**
   * Broadcasts a message to all connected clients, except for those specified in `clientsToIgnore`.
   * @param message - The message to broadcast.
   * @param clientsToIgnore - An optional array of WebSocket instances to exclude from the broadcast.
   */
  public broadcast(message: Message, clientsToIgnore: WebSocket[] = []): void {
    this.connections.forEach(({ websocket }) => {
      if (
        websocket.readyState === WebSocket.OPEN &&
        !clientsToIgnore.includes(websocket)
      ) {
        websocket.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Returns an array of all currently connected clients.
   * @returns An array of `ChatConnection` objects representing the connected clients.
   */
  public getConnections(): ChatConnection[] {
    return this.connections;
  }

  /**
   * Adds a new client connection to the service.
   * @param connection - The `ChatConnection` object representing the new client connection.
   * @returns The same `ChatConnection` object that was passed in.
   */
  public addConnection(connection: ChatConnection): ChatConnection {
    this.connections.push(connection);

    return connection;
  }

  /**
   * Removes a client connection from the service.
   * @param connection - The `ChatConnection` object representing the client connection to remove.
   */
  public removeConnection(connection: ChatConnection): void {
    this.connections = this.connections.filter((c) => c !== connection);
  }
}
