import { httpClient, unwrap } from "./httpClient";
import { BackendUser } from "./authService";

export type ProfileUpdatePayload = Partial<{
  name: string;
  phone: string;
  avatar: string;
  gender: string;
  healthCondition: string;
  licenseNumber: string;
}>;

export async function updateMyProfile(payload: ProfileUpdatePayload): Promise<BackendUser> {
  return unwrap<BackendUser>(httpClient.patch("/users/me", payload));
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await unwrap<null>(httpClient.post("/users/change-password", { currentPassword, newPassword }));
}
