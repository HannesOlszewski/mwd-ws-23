import type { LoginResponse } from "../shared/types";

export async function login(
  baseUrl: string,
  username: string,
  password: string
): Promise<string> {
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  console.log("Login successful");
  const data: LoginResponse = (await response.json()) as LoginResponse;

  return data.token;
}
