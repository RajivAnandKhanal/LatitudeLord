import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import LeafletMap from "../../components/common/LeafletMap";

import CustomInput from "../../components/common/CustomInput";
import MapBusCard from "../../components/common/MapBusCard";
import PageHeader from "../../components/common/PageHeader";

import { useLiveLocation } from "../../hooks/useLiveLocation";
import { useBusesList } from "../../hooks/useBusesList";

import { Bus } from "../../mock/buses";

import { Colors } from "../../theme/colors";
import { calculateDistance, calculateEtaMinutes } from "../../utils/location";

export default function GuestMapScreen() {
  const { location, loading } = useLiveLocation();
  const { buses, loading: busesLoading } = useBusesList();

  const [search, setSearch] = useState("");

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const distanceKm = useMemo(() => {
    if (!selectedBus) return null;

    return calculateDistance(
      location.latitude,
      location.longitude,
      selectedBus.currentLocation.latitude,
      selectedBus.currentLocation.longitude,
    );
  }, [selectedBus, location.latitude, location.longitude]);

  const liveEtaMinutes = useMemo(() => {
    if (distanceKm == null) return null;
    return calculateEtaMinutes(distanceKm);
  }, [distanceKm]);

  const filteredBuses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return buses;
    }

    return buses.filter((bus) => {
      const stationMatches = bus.routeStations.some((station) =>
        station.toLowerCase().includes(query),
      );

      return (
        bus.busNumber.toLowerCase().includes(query) ||
        bus.routeName.toLowerCase().includes(query) ||
        stationMatches
      );
    });
  }, [search, buses]);

  if (loading || busesLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  function getMarkerDescription(bus: Bus) {
    return `${bus.routeName} • ETA ${bus.etaMinutes} min`;
  }

  const busMarkers = filteredBuses.map((bus) => ({
    id: bus.id,
    lat: bus.currentLocation.latitude,
    lng: bus.currentLocation.longitude,
    title: bus.busNumber,
    description: getMarkerDescription(bus),
    color: "#EAB308",
  }));

  const routePolyline = selectedBus
    ? [
        { lat: location.latitude, lng: location.longitude },
        {
          lat: selectedBus.currentLocation.latitude,
          lng: selectedBus.currentLocation.longitude,
        },
      ]
    : undefined;

  function handleMarkerPress(id: string) {
    const bus = filteredBuses.find((b) => b.id === id);
    if (bus) setSelectedBus(bus);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Track Bus" subtitle="Live GPS Tracking" />
      </View>

      <LeafletMap
        style={styles.map}
        center={{ lat: location.latitude, lng: location.longitude }}
        zoom={14}
        markers={busMarkers}
        polyline={routePolyline}
        userLocation={{ lat: location.latitude, lng: location.longitude }}
        onMarkerPress={handleMarkerPress}
      />

      <View style={styles.bottom}>
        <CustomInput
          placeholder="Search bus, route or station"
          value={search}
          onChangeText={setSearch}
        />

        {!selectedBus && (
          <Text style={styles.hint}>
            Tap a bus on the map or in the list below to see its distance from
            you and ETA.
          </Text>
        )}

        {selectedBus && (
          <View style={styles.nearest}>
            <Text style={styles.nearestTitle}>Selected Bus</Text>
            <Text style={styles.nearestBus}>{selectedBus.busNumber}</Text>
            <Text style={styles.nearestText}>{selectedBus.routeName}</Text>
            <Text style={styles.nearestEta}>
              Estimated arrival:{" "}
              {liveEtaMinutes != null ? `${liveEtaMinutes} min` : "—"}
              {distanceKm != null ? ` • ${distanceKm.toFixed(1)} km away` : ""}
            </Text>
          </View>
        )}

        {filteredBuses.map((bus) => (
          <MapBusCard
            key={bus.id}
            bus={bus}
            onPress={() => setSelectedBus(bus)}
          />
        ))}

        {filteredBuses.length === 0 && (
          <Text style={styles.empty}>No buses found.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 100,
  },

  map: {
    flex: 1,
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 420,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  nearest: {
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  nearestTitle: {
    fontWeight: "800",
    marginBottom: 4,
    color: Colors.text,
  },

  nearestBus: {
    fontWeight: "800",
    color: Colors.primary,
  },

  nearestText: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  nearestEta: {
    marginTop: 6,
    marginBottom: 4,
    fontWeight: "700",
    color: Colors.text,
  },

  empty: {
    textAlign: "center",
    paddingVertical: 18,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  hint: {
    marginTop: 4,
    marginBottom: 4,
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});
