import { Socket, io } from "socket.io-client";

import { ENV } from "../config/env";
import { getAccessToken } from "./tokenStorage";

let socket: Socket | null = null;

/**
 * Returns the shared Socket.IO connection, creating it on first use.
 * Auth is optional at the handshake level — anonymous sockets can still
 * subscribe to public location updates (mirrors the public GET routes).
 * Call `reconnectSocket()` after login/logout so the handshake token is
 * re-evaluated with the current session.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}

export async function connectSocket(): Promise<Socket> {
  const instance = getSocket();
  const token = await getAccessToken();
  instance.auth = token ? { token } : {};

  if (!instance.connected) {
    instance.connect();
  }
  return instance;
}

/** Disconnects and re-connects with a fresh auth token (e.g. after login/logout). */
export async function reconnectSocket(): Promise<void> {
  if (socket?.connected) {
    socket.disconnect();
  }
  await connectSocket();
}

export function disconnectSocket(): void {
  socket?.disconnect();
}
