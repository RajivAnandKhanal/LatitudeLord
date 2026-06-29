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
