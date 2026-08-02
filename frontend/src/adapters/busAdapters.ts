import { BackendBus } from "../services/busService";
import { BackendLocation } from "../services/busLocationService";
import { BackendRoute, BackendDaySchedule, BackendDay } from "../services/routeService";
import { calculateDistance } from "../utils/location";
import { Bus } from "../mock/buses";
import { LiveBus } from "../types/location";
import { BusSchedule, DayOfWeek } from "../types/auth";

// Frontend screens were built against a `Bus`/`LiveBus` shape that predates
// the real backend schema (single routeName/driverName/staffName strings vs.
// separate Bus + Route + Driver documents). These adapters bridge that gap
// so screens can keep using their existing types while the data underneath
// is now real.

export function driverName(bus: BackendBus): string {
  return typeof bus.driver === "string" ? "Unknown driver" : bus.driver.name;
}

/** Combines a Bus + its latest Location + (optionally) its Route into the legacy `Bus` shape. */
export function toMockBus(
  bus: BackendBus,
  location: BackendLocation | null,
  route: BackendRoute | null,
): Bus {
  const stations = route?.schedule?.[0]?.stations ?? [];
  const first = stations[0];

  return {
    id: bus._id,
    busNumber: bus.busNumber,
    plateNumber: bus.plateNumber,
    routeName: stations.length
      ? `${stations[0].name} - ${stations[stations.length - 1].name}`
      : "Route not set",
    routeStations: stations.map((s) => s.name),
    lastStation: stations.length ? stations[stations.length - 1].name : "—",
    etaMinutes: location?.etaMinutes ?? 0,
    mlEtaMinutes: location?.etaMinutes ?? undefined,
    distanceKm:
      location?.distanceKm ??
      (location && first ? calculateDistance(location.lat, location.lng, first.lat, first.lng) : 0),
    status: location?.isOnline ? "On Route" : "Delayed",
    driverName: driverName(bus),
    staffName: "—",
    currentLocation: {
      latitude: location?.lat ?? 0,
      longitude: location?.lng ?? 0,
    },
  };
}

export function toLiveBus(bus: BackendBus, location: BackendLocation | null): LiveBus {
  const stations = ["Kalanki", "Koteshwor"]; // placeholder when no route is set
  return {
    id: bus._id,
    busNumber: bus.busNumber,
    routeName: `${bus.plateNumber}`,
    currentLocation: {
      latitude: location?.lat ?? 0,
      longitude: location?.lng ?? 0,
    },
    nextStop: stations[stations.length - 1],
    etaMinutes: location?.etaMinutes ?? 0,
    passengers: 0,
    status: location?.isOnline ? "On Route" : "Stopped",
  };
}

const BACKEND_DAYS: BackendDay[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const FRONTEND_DAYS: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function toBackendDay(day: DayOfWeek): BackendDay {
  return BACKEND_DAYS[FRONTEND_DAYS.indexOf(day)];
}

export function toFrontendDay(day: BackendDay): DayOfWeek {
  return FRONTEND_DAYS[BACKEND_DAYS.indexOf(day)];
}

/** Route.schedule (day + stops) -> the simpler departure-time schedule the driver screens display. */
export function toBusSchedule(schedule: BackendDaySchedule[]): BusSchedule[] {
  return schedule.map((entry) => ({
    dayOfWeek: toFrontendDay(entry.day),
    departureTime: "—",
    routeName: entry.stations.length
      ? `${entry.stations[0].name} → ${entry.stations[entry.stations.length - 1].name}`
      : "No stations set",
  }));
}
