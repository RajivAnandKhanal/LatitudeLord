import { httpClient, unwrap } from "./httpClient";
import { Paginated } from "./busService";

export interface BackendNotification {
  _id: string;
  title: string;
  body: string;
  type: "general" | "chat" | "busArrival" | "system";
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export async function getMyNotifications(): Promise<Paginated<BackendNotification>> {
  return unwrap<Paginated<BackendNotification>>(httpClient.get("/notifications"));
}

export async function markAsRead(id: string): Promise<BackendNotification> {
  return unwrap<BackendNotification>(httpClient.patch(`/notifications/${id}/read`));
}

export async function registerDeviceToken(fcmToken: string): Promise<void> {
  await unwrap(httpClient.post("/notifications/register-token", { fcmToken }));
}

export async function unregisterDeviceToken(): Promise<void> {
  await unwrap(httpClient.delete("/notifications/register-token"));
}
