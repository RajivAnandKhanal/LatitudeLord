import { Bus, buses } from "../mock/buses";

function findBusByQuery(query: string): Bus | undefined {
  const normalized = query.toLowerCase();

  return buses.find(
    (bus) =>
      normalized.includes(bus.busNumber.toLowerCase()) ||
      normalized.includes(bus.busNumber.replace("bus ", "").toLowerCase()) ||
      normalized.includes(bus.plateNumber.toLowerCase()),
  );
}

function findBusesByStation(query: string): Bus[] {
  const normalized = query.toLowerCase();

  return buses.filter((bus) =>
    bus.routeStations.some((station) =>
      normalized.includes(station.toLowerCase()),
    ),
  );
}

function describeBus(bus: Bus): string {
  return `${bus.busNumber} is currently ${bus.status.toLowerCase()} on the ${bus.routeName} route, about ${bus.distanceKm} km away. Estimated arrival: ${bus.etaMinutes} min.`;
}

export function getBotReply(message: string): string {
  const text = message.trim().toLowerCase();

  if (!text) {
    return "Ask me about a bus number, a route, or a station and I'll help you find it.";
  }

  if (/\b(hi|hello|hey|namaste)\b/.test(text)) {
    return "Hello! I can help you find buses, check ETAs, or look up routes. What would you like to know?";
  }

  const matchedBus = findBusByQuery(text);

  if (matchedBus && /(where|eta|arrival|time|status|location)/.test(text)) {
    return describeBus(matchedBus);
  }

  if (matchedBus) {
    return `${describeBus(matchedBus)} Route stations: ${matchedBus.routeStations.join(" → ")}.`;
  }

  if (/(nearby|near me|close|closest)/.test(text)) {
    const sorted = [...buses].sort((a, b) => a.distanceKm - b.distanceKm);
    const nearest = sorted[0];

    return `The closest bus right now is ${nearest.busNumber} on ${nearest.routeName}, about ${nearest.distanceKm} km away with an ETA of ${nearest.etaMinutes} min.`;
  }

  const stationMatches = findBusesByStation(text);

  if (stationMatches.length > 0) {
    const names = stationMatches.map((bus) => bus.busNumber).join(", ");
    return `These buses pass through that station: ${names}. Ask me about one of them for more details.`;
  }

  if (/(route|go to|going to|reach)/.test(text)) {
    const routeList = buses.map((bus) => `${bus.busNumber} (${bus.routeName})`).join(", ");
    return `Here are the routes currently running: ${routeList}. Tell me a bus number or station and I'll check it for you.`;
  }

  if (/(thank|thanks)/.test(text)) {
    return "You're welcome! Let me know if you need anything else about your bus.";
  }

  return "I didn't quite catch that. Try asking about a specific bus number (e.g. \"Where is Bus 12?\"), a station, or say \"buses near me\".";
}
