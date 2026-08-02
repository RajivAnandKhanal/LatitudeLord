import { httpClient, unwrap } from "./httpClient";
import { Paginated } from "./busService";

export interface BackendStaff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: "staff";
  linkedDriver: string;
  isActive: boolean;
  createdAt: string;
}

export async function createStaff(payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<BackendStaff> {
  return unwrap<BackendStaff>(httpClient.post("/staff", payload));
}

export async function getMyStaff(): Promise<Paginated<BackendStaff>> {
  return unwrap<Paginated<BackendStaff>>(httpClient.get("/staff"));
}

export async function getStaffById(id: string): Promise<BackendStaff> {
  return unwrap<BackendStaff>(httpClient.get(`/staff/${id}`));
}

export async function updateStaff(
  id: string,
  payload: Partial<{ name: string; phone: string; avatar: string; isActive: boolean }>,
): Promise<BackendStaff> {
  return unwrap<BackendStaff>(httpClient.patch(`/staff/${id}`, payload));
}

export async function removeStaff(id: string): Promise<void> {
  await unwrap<null>(httpClient.delete(`/staff/${id}`));
}
