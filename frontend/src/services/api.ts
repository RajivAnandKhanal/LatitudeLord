// Thin convenience wrappers around httpClient. Prefer importing the
// domain services (authService, busService, etc.) directly — this file
// exists only for callers that want a bare GET/POST without a typed wrapper.
import { httpClient, unwrap } from "./httpClient";

export async function apiGet<T = unknown>(endpoint: string) {
  return unwrap<T>(httpClient.get(endpoint));
}

export async function apiPost<T = unknown>(endpoint: string, body: unknown) {
  return unwrap<T>(httpClient.post(endpoint, body));
}
