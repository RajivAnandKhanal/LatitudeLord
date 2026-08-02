import { httpClient, unwrap } from "./httpClient";

export interface BackendJourneySnapshot {
  lat: number;
  lng: number;
  speedKmh: number;
  recordedAt: string;
}

export interface BackendJourney {
  _id: string;
  user: string;
  bus: string;
  status: "ongoing" | "completed" | "cancelled";
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number } | null;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  distanceKm: number | null;
  snapshots: BackendJourneySnapshot[];
}

export async function startJourney(payload: {
  busId: string;
  lat: number;
  lng: number;
}): Promise<BackendJourney> {
  return unwrap<BackendJourney>(httpClient.post("/journeys/start", payload));
}

export async function addSnapshot(
  journeyId: string,
  payload: { lat: number; lng: number; speedKmh?: number },
): Promise<BackendJourney> {
  return unwrap<BackendJourney>(httpClient.post(`/journeys/${journeyId}/snapshot`, payload));
}

export async function endJourney(
  journeyId: string,
  payload: { lat: number; lng: number },
): Promise<BackendJourney> {
  return unwrap<BackendJourney>(httpClient.post(`/journeys/${journeyId}/end`, payload));
}

export async function cancelJourney(journeyId: string): Promise<BackendJourney> {
  return unwrap<BackendJourney>(httpClient.post(`/journeys/${journeyId}/cancel`));
}

export async function getActiveJourney(): Promise<BackendJourney | null> {
  return unwrap<BackendJourney | null>(httpClient.get("/journeys/active"));
}

export async function getMyJourneys(): Promise<BackendJourney[]> {
  return unwrap<BackendJourney[]>(httpClient.get("/journeys/me"));
}
