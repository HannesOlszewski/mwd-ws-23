import type http from "node:http";

/**
 * Parses the request data as JSON and returns it as an object of type T.
 * @param req - The incoming HTTP request object.
 * @returns A Promise that resolves to an object of type T.
 * @throws An error if the request method is not POST or the content type is not application/json.
 */
export async function parseRequestDataAsJson<T extends object>(
  req: http.IncomingMessage
): Promise<T> {
  if (req.method !== "POST") {
    throw new Error("Invalid request method");
  }

  if (req.headers["content-type"] !== "application/json") {
    throw new Error("Invalid request content type");
  }

  const body = await new Promise<string>((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      resolve(data);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });

  return JSON.parse(body) as T;
}
