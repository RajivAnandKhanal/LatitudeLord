import { Platform } from "react-native";

/**
 * Backend connection config.
 *
 * Override via `.env` (see `.env.example`):
 *   EXPO_PUBLIC_API_URL=http://192.168.1.23:5000
 *
 * `localhost` only works when the app runs in a web browser on the same
 * machine as the backend. Physical devices and simulators need your
 * computer's LAN IP (Android emulator specifically uses 10.0.2.2, which
 * aliases the host machine).
 */
function resolveDefaultHost(): string {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }
  return "http://localhost:5000";
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? resolveDefaultHost()).replace(/\/+$/, "");

export const ENV = {
  API_BASE_URL,
  API_URL: `${API_BASE_URL}/api/v1`,
  SOCKET_URL: API_BASE_URL,
};
