import { httpClient, unwrap } from "./httpClient";
import { getSocket } from "./socket";

export interface BackendChatMessage {
  _id: string;
  room: string;
  bus: string;
  senderId: string;
  senderModel: "User" | "Driver";
  senderRole: "passenger" | "driver" | "staff";
  text: string;
  readAt: string | null;
  createdAt: string;
}

export async function getMessages(busId: string): Promise<BackendChatMessage[]> {
  return unwrap<BackendChatMessage[]>(httpClient.get(`/chat/${busId}/messages`));
}

/** REST fallback for sending a message. Prefer the socket for live delivery. */
export async function sendMessageRest(busId: string, text: string): Promise<BackendChatMessage> {
  return unwrap<BackendChatMessage>(httpClient.post(`/chat/${busId}/messages`, { text }));
}

export function joinChatRoom(busId: string) {
  getSocket().emit("chat:join", { busId });
}

export function leaveChatRoom(busId: string) {
  getSocket().emit("chat:leave", { busId });
}

export function onChatMessage(handler: (message: BackendChatMessage) => void) {
  getSocket().on("chat:message", handler);
  return () => getSocket().off("chat:message", handler);
}

export function sendChatMessage(
  busId: string,
  text: string,
): Promise<{ success: boolean; message?: string; data?: BackendChatMessage }> {
  return new Promise((resolve) => {
    getSocket().emit(
      "chat:message",
      { busId, text },
      (ack: { success: boolean; message?: string; data?: BackendChatMessage }) => resolve(ack),
    );
  });
}
