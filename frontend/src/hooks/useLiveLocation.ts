import { useEffect, useState } from "react";

import {
  AppLocation,
  DEFAULT_LOCATION,
  getCurrentLocation,
} from "../services/locationService";

export function useLiveLocation() {
  const [location, setLocation] = useState<AppLocation>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      try {
        const currentLocation = await getCurrentLocation();

        if (mounted) {
          setLocation(currentLocation);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    location,
    loading,
  };
}
