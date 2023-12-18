import type http from "node:http";
import type { LoginData, LoginResponse } from "../shared/types";
import { parseRequestDataAsJson } from "./http-utils";
import { UserRepository } from "./user-utils";

/**
 * Handles a login request.
 * @param req - The incoming HTTP request.
 * @param res - The HTTP response to send.
 * @returns A Promise that resolves when the response has been sent.
 */
export async function handleLogin(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const data = await parseRequestDataAsJson<LoginData>(req);

  const userRepository = new UserRepository();
  const users = userRepository.getUsers();
  const user = users.find((u) => u.username === data.username);

  if (user !== undefined && user.password === data.password) {
    const responseData: LoginResponse = { token: data.username };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(JSON.stringify(responseData)));
  } else {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid username or password" }));
  }
}

/**
 * Authenticates a request by checking if a valid token is present in the URL query parameters.
 * @param request - The incoming HTTP request to authenticate.
 * @param callback - The callback function to call with the authentication result.
 */
export function authenticate(
  request: http.IncomingMessage,
  callback: (err: Error | null, client?: string) => void,
): void {
  if (!request.url) {
    callback(new Error("Missing token"));
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get("token");

  const userRepository = new UserRepository();
  const users = userRepository.getUsers();
  const isValidToken =
    token && users.find((u) => u.username === token) !== undefined;

  if (isValidToken) {
    callback(null, token);
  } else {
    callback(new Error("Missing or invalid token"));
  }
}
