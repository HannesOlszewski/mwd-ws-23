import type { WebSocket } from "ws";

/**
 * Represents the data required for a user login.
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Represents the response object returned by the login API endpoint.
 */
export interface LoginResponse {
  token: string;
}

/**
 * Represents a user in the system.
 */
export interface User {
  /**
   * The username of the user.
   */
  username: string;
  /**
   * The password of the user.
   */
  password: string;
}

/**
 * Represents a connection to a chat room.
 */
export interface ChatConnection {
  /**
   * The username associated with the connection.
   */
  username: string;
  /**
   * The WebSocket object used for communication.
   */
  websocket: WebSocket;
}

/**
 * Represents a chat message.
 */
export interface Message {
  from?: string;
  message: string;
}
