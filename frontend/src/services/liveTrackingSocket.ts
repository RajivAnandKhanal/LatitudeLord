import { getSocket } from "./socket";
import { BackendLocation } from "./busLocationService";

export function subscribeToBus(busId: string) {
  getSocket().emit("location:subscribe", { busId });
}

export function unsubscribeFromBus(busId: string) {
  getSocket().emit("location:unsubscribe", { busId });
}

export function onLocationUpdate(handler: (location: BackendLocation) => void) {
  getSocket().on("location:update", handler);
  return () => getSocket().off("location:update", handler);
}

/** Driver-only — push a live GPS ping over the socket (falls back to REST if it fails). */
export function pingLocation(
  busId: string,
  payload: { lat: number; lng: number; speedKmh?: number; heading?: number },
): Promise<{ success: boolean; message?: string; data?: BackendLocation }> {
  return new Promise((resolve) => {
    getSocket().emit(
      "location:ping",
      { busId, ...payload },
      (ack: { success: boolean; message?: string; data?: BackendLocation }) => resolve(ack),
    );
  });
}
