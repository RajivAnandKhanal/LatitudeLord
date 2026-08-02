import axios, { AxiosError, AxiosInstance } from "axios";

import { ENV } from "../config/env";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./tokenStorage";

export type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

// Called when a refresh attempt fails (refresh token expired/invalid) so the
// app can drop back to a logged-out state. Registered by AuthContext.
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: () => void) {
  onSessionExpired = handler;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refreshes the access token at most once at a time — concurrent 401s all
// await the same in-flight refresh instead of each firing their own.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>(
      `${ENV.API_URL}/auth/refresh-token`,
      { refreshToken },
    );
    const tokens = response.data.data;
    await saveTokens(tokens);
    return tokens.accessToken;
  } catch {
    await clearTokens();
    onSessionExpired?.();
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retried?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(original);
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

export class ApiRequestError extends Error {
  statusCode: number;
  errors: string[];

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

function normalizeError(error: AxiosError): ApiRequestError {
  const data = error.response?.data as Partial<ApiEnvelope<unknown>> & { errors?: string[] };
  const message = data?.message || error.message || "Something went wrong";
  return new ApiRequestError(message, error.response?.status ?? 0, data?.errors ?? []);
}

/** Unwraps the backend's `{ data }` envelope, throwing ApiRequestError on failure. */
export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}
