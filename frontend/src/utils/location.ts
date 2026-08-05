export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Average city bus speed used to estimate arrival time from distance.
const AVERAGE_BUS_SPEED_KMH = 20;

export function calculateEtaMinutes(
  distanceKm: number,
  speedKmh: number = AVERAGE_BUS_SPEED_KMH,
): number {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  return Math.round((distanceKm / speedKmh) * 60);
}
