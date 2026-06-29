export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LiveBus {
  id: string;

  busNumber: string;

  routeName: string;

  currentLocation: Coordinate;

  nextStop: string;

  etaMinutes: number;

  passengers: number;

  status: "On Route" | "Delayed" | "Stopped";

  isFavorite?: boolean;
}
