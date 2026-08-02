import { httpClient, unwrap } from "./httpClient";

export interface BackendBusDriver {
  _id: string;
  name: string;
  phone?: string | null;
}

export interface BackendBus {
  _id: string;
  busNumber: string;
  plateNumber: string;
  capacity?: number | null;
  driver: BackendBusDriver | string;
  route?: string | null;
  status: "active" | "maintenance" | "inactive";
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export async function getAllBuses(params?: {
  status?: string;
  driver?: "me" | string;
  page?: number;
  limit?: number;
}): Promise<Paginated<BackendBus>> {
  return unwrap<Paginated<BackendBus>>(httpClient.get("/buses", { params }));
}

export async function getBusById(id: string): Promise<BackendBus> {
  return unwrap<BackendBus>(httpClient.get(`/buses/${id}`));
}

export async function createBus(payload: {
  busNumber: string;
  plateNumber: string;
  capacity?: number;
}): Promise<BackendBus> {
  return unwrap<BackendBus>(httpClient.post("/buses", payload));
}

export async function updateBus(
  id: string,
  payload: Partial<{
    busNumber: string;
    plateNumber: string;
    capacity: number;
    status: "active" | "maintenance" | "inactive";
  }>,
): Promise<BackendBus> {
  return unwrap<BackendBus>(httpClient.patch(`/buses/${id}`, payload));
}

export async function deleteBus(id: string): Promise<void> {
  await unwrap<null>(httpClient.delete(`/buses/${id}`));
}
