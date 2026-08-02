import { useEffect, useState } from "react";

import * as busService from "../services/busService";
import * as locationApi from "../services/busLocationService";
import * as routeService from "../services/routeService";
import { toMockBus } from "../adapters/busAdapters";
import { connectSocket } from "../services/socket";
import { onLocationUpdate, subscribeToBus, unsubscribeFromBus } from "../services/liveTrackingSocket";
import { Bus } from "../mock/buses";

export function useBusDetails(busId: string | undefined) {
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [backendBus, location, route] = await Promise.all([
          busService.getBusById(busId),
          locationApi.getLocation(busId).catch(() => null),
          routeService.getScheduleByBus(busId).catch(() => null),
        ]);
        if (!cancelled) setBus(toMockBus(backendBus, location, route));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this bus.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [busId]);

  useEffect(() => {
    if (!busId) return;

    let cancelled = false;
    connectSocket().then(() => {
      if (!cancelled) subscribeToBus(busId);
    });

    const unsubscribe = onLocationUpdate((location) => {
      if (location.bus !== busId) return;
      setBus((prev) =>
        prev
          ? {
              ...prev,
              currentLocation: { latitude: location.lat, longitude: location.lng },
              etaMinutes: location.etaMinutes ?? prev.etaMinutes,
              mlEtaMinutes: location.etaMinutes ?? prev.mlEtaMinutes,
              status: location.isOnline ? "On Route" : "Delayed",
            }
          : prev,
      );
    });

    return () => {
      cancelled = true;
      unsubscribeFromBus(busId);
      unsubscribe();
    };
  }, [busId]);

  return { bus, loading, error };
}
