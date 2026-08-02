import * as Location from "expo-location";

export type AppLocation = {
  latitude: number;
  longitude: number;
};

export const DEFAULT_LOCATION: AppLocation = {
  latitude: 27.7172,
  longitude: 85.324,
};

export async function getCurrentLocation(): Promise<AppLocation> {
  const permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    return DEFAULT_LOCATION;
  }

  const lastKnownPosition = await Location.getLastKnownPositionAsync();

  if (lastKnownPosition) {
    return {
      latitude: lastKnownPosition.coords.latitude,
      longitude: lastKnownPosition.coords.longitude,
    };
  }

  const currentPosition = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: currentPosition.coords.latitude,
    longitude: currentPosition.coords.longitude,
  };
}

export type LivePosition = AppLocation & { speedKmh: number; heading: number | null };

/**
 * Streams the device's GPS position (driver-side, for broadcasting a bus's
 * live location). Returns an unsubscribe function.
 */
export async function watchLivePosition(
  onUpdate: (position: LivePosition) => void,
): Promise<() => void> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted") {
    throw new Error("Location permission is required to broadcast a live position.");
  }

  const subscription = await Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 10 },
    (position) => {
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speedKmh: position.coords.speed ? Math.max(0, position.coords.speed * 3.6) : 0,
        heading: position.coords.heading ?? null,
      });
    },
  );

  return () => subscription.remove();
}
