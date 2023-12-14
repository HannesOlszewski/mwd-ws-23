import { Column } from "./database";

/**
 * Represents a response message.
 */
export type ResponseMessage =
  | {
      /**
       * The status of the response.
       */
      status: "ok";
      /**
       * The data of the response.
       */
      data: unknown;
    }
  | {
      /**
       * The status of the response.
       */
      status: "error";
      /**
       * The message of the response.
       */
      message: string;
    };

export type EventName =
  | "add-table"
  | "delete-table"
  | "add-column"
  | "delete-column";

/**
 * Represents an event from the api.
 */
export interface ApiEvent {
  /**
   * The type of the event.
   */
  type: EventName;
}

/**
 * Represents an event for when a table was added.
 */
export interface AddTableEvent extends ApiEvent {
  type: "add-table";
  /**
   * The name of the table that was added.
   */
  table: string;
}

/**
 * Represents an event for when a table was deleted.
 */
export interface DeleteTableEvent extends ApiEvent {
  type: "delete-table";
  /**
   * The name of the table that was deleted.
   */
  table: string;
}

/**
 * Represents an event for when a column was added.
 */
export interface AddColumnEvent extends ApiEvent {
  type: "add-column";
  /**
   * The name of the table where the column was added.
   */
  table: string;
  /**
   * The column that was added.
   */
  column: Column;
}

/**
 * Represents an event for when a column was deleted.
 */
export interface DeleteColumnEvent extends ApiEvent {
  type: "delete-column";
  /**
   * The name of the table where the column was deleted.
   */
  table: string;
  /**
   * The name of the column that was deleted.
   */
  column: string;
}
