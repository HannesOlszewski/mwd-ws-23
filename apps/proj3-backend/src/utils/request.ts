import type express from "express";

/**
 * Parses the request parameters.
 *
 * @param req - The request.
 *
 * @returns The request parameters.
 */
export function parseRequestParams<T>(req: express.Request): T {
  return req.params as T;
}

/**
 * Parses the request data/body.
 *
 * @param req - The request.
 *
 * @returns The request data/body.
 */
export function parseRequestData<T>(req: express.Request): T {
  return req.body as T;
}

/**
 * Parses the request query.
 *
 * @param req - The request.
 *
 * @returns The request query.
 */
export function parseRequestQuery<T>(req: express.Request): T {
  return req.query as T;
}
