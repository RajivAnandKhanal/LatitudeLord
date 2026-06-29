export type BusLocation = {
  latitude: number;
  longitude: number;
};

export type Bus = {
  id: string;
  busNumber: string;
  plateNumber: string;
  routeName: string;
  routeStations: string[];
  lastStation: string;
  etaMinutes: number;
  mlEtaMinutes?: number;
  distanceKm: number;
  status: "Approaching" | "On Route" | "Delayed";
  driverName: string;
  staffName: string;
  currentLocation: BusLocation;
};

export const buses: Bus[] = [
  {
    id: "bus-1",
    busNumber: "Bus 12",
    plateNumber: "Ba 3 Kha 2245",
    routeName: "Kalanki - Koteshwor",
    routeStations: [
      "Kalanki",
      "Kalimati",
      "Tripureshwor",
      "New Baneshwor",
      "Koteshwor",
    ],
    lastStation: "Koteshwor",
    etaMinutes: 4,
    mlEtaMinutes: 5,
    distanceKm: 1.2,
    status: "Approaching",
    driverName: "Ram Sharma",
    staffName: "Sita Thapa",
    currentLocation: {
      latitude: 27.7017,
      longitude: 85.3206,
    },
  },
  {
    id: "bus-2",
    busNumber: "Bus 21",
    plateNumber: "Ba 5 Kha 7812",
    routeName: "Lagankhel - Ratnapark",
    routeStations: [
      "Lagankhel",
      "Jawalakhel",
      "Thapathali",
      "Tripureshwor",
      "Ratnapark",
    ],
    lastStation: "Ratnapark",
    etaMinutes: 7,
    mlEtaMinutes: 8,
    distanceKm: 2.4,
    status: "On Route",
    driverName: "Hari Karki",
    staffName: "Bikash Rai",
    currentLocation: {
      latitude: 27.6905,
      longitude: 85.3158,
    },
  },
  {
    id: "bus-3",
    busNumber: "Bus 32",
    plateNumber: "Ba 4 Kha 6621",
    routeName: "Bhaktapur - Baneshwor",
    routeStations: ["Bhaktapur", "Thimi", "Koteshwor", "Tinkune", "Baneshwor"],
    lastStation: "Baneshwor",
    etaMinutes: 11,
    distanceKm: 3.8,
    status: "On Route",
    driverName: "Raju KC",
    staffName: "Dipesh Shrestha",
    currentLocation: {
      latitude: 27.6809,
      longitude: 85.3491,
    },
  },
];

export function findBusByPlate(plateNumber: string): Bus | undefined {
  const normalized = plateNumber.trim().toLowerCase();

  return buses.find((bus) => bus.plateNumber.trim().toLowerCase() === normalized);
}
