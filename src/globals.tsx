import { useLocation } from "preact-iso";
const isDev: boolean = import.meta.env.MODE === "development";

// Dev Tools
if (isDev) {
	document.addEventListener("keydown", (event: KeyboardEvent) => {
 		 if (event.key === "|") { 
   			 document.querySelector('body').classList.toggle('with-perspective');
  		}
	});
}

// Defaults, Preferences and Configuration
let prefersDark = false;
switch (localStorage.getItem("prefersDark")) {
	case 'true': prefersDark = true; break;
	case 'false': prefersDark = false; break;
	case null:
		prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
}
document.documentElement.className = prefersDark ? 'isDark' : '';
localStorage.setItem("prefersDark", prefersDark); 

export const isDark: boolean = prefersDark;
export const showHelp: boolean = localStorage.getItem('show-help') === 'true';
if (showHelp) {
  document.documentElement.style.setProperty('--show-help-display', 'block')
}


// API helpers
export const apiUrl: string = isDev ? "http://localhost:8000" : "/api";
async function api(
  method: string,
  path: string,
  body: object,
): Promise<Response> {
  try {
    const url = `${apiUrl}${path}`;
    const credentials = "include";

    const response = method === "GET" ? 
      await fetch(url, { credentials: credentials }) : 
      await fetch(url, {
        method: method,
        credentials: credentials,
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


