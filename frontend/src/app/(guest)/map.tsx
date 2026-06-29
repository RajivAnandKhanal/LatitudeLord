import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

import CustomInput from "../../components/common/CustomInput";
import MapBusCard from "../../components/common/MapBusCard";
import PageHeader from "../../components/common/PageHeader";

import { useLiveLocation } from "../../hooks/useLiveLocation";

import { Bus, buses } from "../../mock/buses";

import { Colors } from "../../theme/colors";

export default function GuestMapScreen() {
  const { location, loading } = useLiveLocation();

  const [search, setSearch] = useState("");

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

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
  }, [search]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  function getMarkerDescription(bus: Bus) {
    return `${bus.routeName} • ETA ${bus.etaMinutes} min`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Track Bus" subtitle="Live GPS Tracking" />
      </View>

      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {filteredBuses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.currentLocation}
            title={bus.busNumber}
            description={getMarkerDescription(bus)}
            onPress={() => setSelectedBus(bus)}
          />
        ))}
      </MapView>

      <View style={styles.bottom}>
        <CustomInput
          placeholder="Search bus, route or station"
          value={search}
          onChangeText={setSearch}
        />

        {selectedBus && (
          <View style={styles.nearest}>
            <Text style={styles.nearestTitle}>Selected Bus</Text>
            <Text style={styles.nearestBus}>{selectedBus.busNumber}</Text>
            <Text style={styles.nearestText}>{selectedBus.routeName}</Text>
            <Text style={styles.nearestEta}>
              Estimated arrival: {selectedBus.etaMinutes} min (GPS only)
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
});
