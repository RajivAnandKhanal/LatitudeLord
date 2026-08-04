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

export async function updateMyProfile(
  payload: ProfileUpdatePayload,
): Promise<BackendUser> {
  return unwrap<BackendUser>(httpClient.patch("/users/me", payload));
}

/**
 * Uploads a local image (a device file:// / content:// / ph:// URI from the
 * image picker) to the backend, which stores it in Cloudinary and returns
 * the resulting permanent URL. Local picker URIs only resolve on the device
 * that picked them during that app session — saving one directly as the
 * avatar is why photos disappeared after logout/login. Always upload first
 * and persist the returned URL instead.
 */
export async function uploadAvatar(localUri: string): Promise<string> {
  const filename = localUri.split("/").pop() || `avatar-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : "jpg";
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();
  // React Native's FormData accepts this { uri, name, type } shape for files.
  formData.append("avatar", {
    uri: localUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  const user = await unwrap<BackendUser>(
    httpClient.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
  return user.avatar ?? "";
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await unwrap<null>(
    httpClient.post("/users/change-password", { currentPassword, newPassword }),
  );
}
