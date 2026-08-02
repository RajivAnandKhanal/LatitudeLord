import { httpClient, unwrap } from "./httpClient";

export interface BackendLocation {
  bus: string;
  lat: number;
  lng: number;
  speedKmh: number;
  heading: number | null;
  lastPingAt: string;
  isOnline: boolean;
  etaMinutes?: number | null;
  distanceKm?: number | null;
}

export async function getAllActiveLocations(): Promise<BackendLocation[]> {
  return unwrap<BackendLocation[]>(httpClient.get("/location"));
}

export async function getLocation(busId: string): Promise<BackendLocation> {
  return unwrap<BackendLocation>(httpClient.get(`/location/${busId}`));
}

/** REST fallback for pushing a location ping — the socket `location:ping` event is preferred while connected. */
export async function pushLocation(
  busId: string,
  payload: { lat: number; lng: number; speedKmh?: number; heading?: number },
): Promise<BackendLocation> {
  return unwrap<BackendLocation>(httpClient.post(`/location/${busId}`, payload));
}
