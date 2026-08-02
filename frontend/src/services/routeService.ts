import { httpClient, unwrap } from "./httpClient";
import { Paginated, BackendBus } from "./busService";

export interface BackendStation {
  name: string;
  lat: number;
  lng: number;
}

export type BackendDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface BackendDaySchedule {
  day: BackendDay;
  stations: BackendStation[];
}

export interface BackendRoute {
  _id: string;
  busId: string | BackendBus;
  schedule: BackendDaySchedule[];
  createdAt: string;
}

export async function getAllRoutes(params?: {
  page?: number;
  limit?: number;
}): Promise<Paginated<BackendRoute>> {
  return unwrap<Paginated<BackendRoute>>(httpClient.get("/routes", { params }));
}

export async function getScheduleByBus(busId: string): Promise<BackendRoute> {
  return unwrap<BackendRoute>(httpClient.get(`/routes/${busId}`));
}

export async function setSchedule(
  busId: string,
  schedule: BackendDaySchedule[],
): Promise<BackendRoute> {
  return unwrap<BackendRoute>(httpClient.put(`/routes/${busId}`, { schedule }));
}

export async function deleteSchedule(busId: string): Promise<void> {
  await unwrap<null>(httpClient.delete(`/routes/${busId}`));
}
