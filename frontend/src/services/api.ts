const API_BASE_URL = "https://api.latitudelord.com";

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  return response.json();
}

export async function apiPost(endpoint: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });

  return response.json();
}
