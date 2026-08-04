import { httpClient, unwrap } from "./httpClient";
import { clearTokens, saveTokens } from "./tokenStorage";

export type BackendRole = "passenger" | "driver" | "staff";

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  gender?: string | null;
  healthCondition?: string | null;
  licenseNumber?: string | null;
  role: BackendRole;
  createdAt?: string;
}

export interface AuthResult {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  role: BackendRole;
  phone?: string;
}): Promise<AuthResult> {
  const result = await unwrap<AuthResult>(
    httpClient.post("/auth/register", payload),
  );
  await saveTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  return result;
}

export async function login(payload: {
  email: string;
  password: string;
  role: BackendRole;
}): Promise<AuthResult> {
  const result = await unwrap<AuthResult>(
    httpClient.post("/auth/login", payload),
  );
  await saveTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  return result;
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post("/auth/logout");
  } finally {
    await clearTokens();
  }
}

export async function getMe(): Promise<BackendUser> {
  return unwrap<BackendUser>(httpClient.get("/auth/me"));
}

export async function forgotPassword(email: string): Promise<void> {
  await unwrap<null>(httpClient.post("/auth/forgot-password", { email }));
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  await unwrap<null>(
    httpClient.post("/auth/reset-password", { email, code, newPassword }),
  );
}
