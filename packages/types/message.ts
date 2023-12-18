import { Column } from "./database";

/**
 * Represents a response object.
 */
interface Response {
  /**
   * The status of the response.
   */
  status: "ok" | "error";
}

/**
 * Represents a successful response with data.
 * @template T The type of the response data.
 */
interface OkResponse<T> extends Response {
  status: "ok";
  /**
   * The data of the response.
   */
  data: T;
}

/**
 * Represents an error response.
 */
interface ErrorResponse extends Response {
  status: "error";
  /**
   * The message of the response.
   */
  message: string;
}

/**
 * Represents a response message.
 */
export type ResponseMessage<T = unknown> = OkResponse<T> | ErrorResponse;

/**
 * Represents the name of an event.
 * Possible values include:
 * - "add-table"
 * - "delete-table"
 * - "add-column"
 * - "delete-column"
 * - "add-row"
 * - "update-row"
 * - "delete-row"
 */
export type EventName =
  | "add-database"
  | "delete-database"
  | "add-table"
  | "delete-table"
  | "add-column"
  | "delete-column"
  | "add-row"
  | "update-row"
  | "delete-row";

/**
 * Represents an event from the api.
 */
export interface ApiEvent {
  /**
   * The type of the event.
   */
  type: EventName;
  /**
   * The database that the event is for.
   */
  database: string;
  /**
   * The table that the event is for.
   */
  table?: string;
  /**
   * The column that the event is for.
   */
  column?: Column | string;
  /**
   * The row that the event is for.
   */
  row?: Record<string, unknown>;
}

/**
 * Represents an event for when a database was added.
 */
export interface AddDatabaseEvent extends ApiEvent {
  type: "add-database";
}

/**
 * Represents an event for when a database was deleted.
 */
export interface DeleteDatabaseEvent extends ApiEvent {
  type: "delete-database";
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

export interface AddRowEvent extends ApiEvent {
  type: "add-row";
  /**
   * The name of the table where the row was added.
   */
  table: string;
  /**
   * The row that was added.
   */
  row: Record<string, unknown>;
}

export interface UpdateRowEvent extends ApiEvent {
  type: "update-row";
  /**
   * The name of the table where the row was updated.
   */
  table: string;
  /**
   * The row that was updated.
   */
  row: Record<string, unknown>;
}

export interface DeleteRowEvent extends ApiEvent {
  type: "delete-row";
  /**
   * The name of the table where the row was deleted.
   */
  table: string;
  /**
   * The row that was deleted.
   */
  row: Record<string, unknown>;
}
