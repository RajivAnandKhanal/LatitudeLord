import { useCallback, useEffect, useState } from "react";

import * as busService from "../services/busService";
import * as locationApi from "../services/busLocationService";
import * as routeService from "../services/routeService";
import { toMockBus } from "../adapters/busAdapters";
import { connectSocket } from "../services/socket";
import { onLocationUpdate, subscribeToBus, unsubscribeFromBus } from "../services/liveTrackingSocket";
import { Bus } from "../mock/buses";

/**
 * Fetches every active bus (+ its latest location + weekly route) and keeps
 * each one's position live via the `location:update` socket event. This is
 * the real-data replacement for the old static `mock/buses.ts` array.
 */
export function useBusesList() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ items: backendBuses }, locations] = await Promise.all([
        busService.getAllBuses({ status: "active" }),
        locationApi.getAllActiveLocations().catch(() => []),
      ]);

      const locationByBus = new Map(locations.map((loc) => [loc.bus, loc]));

      const mapped = await Promise.all(
        backendBuses.map(async (bus) => {
          const route = await routeService.getScheduleByBus(bus._id).catch(() => null);
          return toMockBus(bus, locationByBus.get(bus._id) ?? null, route);
        }),
      );

      setBuses(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load buses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live-update every bus's position as pings arrive.
  useEffect(() => {
    if (buses.length === 0) return;

    let cancelled = false;

    connectSocket().then(() => {
      if (cancelled) return;
      buses.forEach((bus) => subscribeToBus(bus.id));
    });

    const unsubscribe = onLocationUpdate((location) => {
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === location.bus
            ? {
                ...bus,
                currentLocation: { latitude: location.lat, longitude: location.lng },
                etaMinutes: location.etaMinutes ?? bus.etaMinutes,
                mlEtaMinutes: location.etaMinutes ?? bus.mlEtaMinutes,
                status: location.isOnline ? "On Route" : "Delayed",
              }
            : bus,
        ),
      );
    });

    return () => {
      cancelled = true;
      buses.forEach((bus) => unsubscribeFromBus(bus.id));
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buses.length]);

  return { buses, loading, error, refresh: load };
}
