import type { ResponseMessage } from "types";

/**
 * Returns a success response message.
 *
 * @param data - Optional data to include in the response.
 *
 * @returns The success response message.
 */
export function successMessage(data?: unknown): ResponseMessage {
  return {
    status: "ok",
    data,
  };
}

/**
 * Returns an error response message.
 *
 * @param message - The error message.
 *
 * @returns The error response message.
 */
export function errorMessage(message: string): ResponseMessage {
  return {
    status: "error",
    message,
  };
}
