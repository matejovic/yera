import { useLocation } from "preact-iso";

const isDev = import.meta.env.MODE === "development";
export const apiUrl: string = isDev ? "http://localhost:8000" : "/api";
export const showHelp: boolean = localStorage.getItem('show-help') === 'true';

async function api(
  method: string,
  path: string,
  body: object,
): Promise<Response> {
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error; // Re-throw to allow handling in calling code
  }
}

export async function api_post(path: string, body: object): Promise<Response> {
  return api("POST", path, body);
}

export async function api_get(path: string, body?: object): Promise<Response> {
  return api("GET", path, body);
}

export async function api_put(path: string, body: object): Promise<Response> {
  return api("PUT", path, body);
}

// ... other exports

export function redirect(url: string) {
  window.redirect = url;
}
