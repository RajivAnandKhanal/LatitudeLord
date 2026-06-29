import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, { Marker, Polyline } from "react-native-maps";

import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import MapBusCard from "../../components/common/MapBusCard";


import { useJourney } from "../../hooks/useJourney";
import { useLiveLocation } from "../../hooks/useLiveLocation";

import { Bus, buses } from "../../mock/buses";

import { Colors } from "../../theme/colors";
import { calculateDistance } from "../../utils/location";

export default function PassengerMapScreen() {
  const { location, loading } = useLiveLocation();

  const { boardBus } = useJourney();

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
        bus.plateNumber.toLowerCase().includes(query) ||
        bus.routeName.toLowerCase().includes(query) ||
        stationMatches
      );
    });
  }, [search]);

  const nearestBus = useMemo(() => {
    if (filteredBuses.length === 0) {
      return null;
    }

    let nearest = filteredBuses[0];

    let minDistance = Infinity;

    filteredBuses.forEach((bus) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        bus.currentLocation.latitude,
        bus.currentLocation.longitude,
      );

      if (distance < minDistance) {
        minDistance = distance;

        nearest = bus;
      }
    });

    return nearest;
  }, [filteredBuses, location.latitude, location.longitude]);

  const activeBus = selectedBus ?? nearestBus;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  function handleBoardBus() {
  if (!activeBus) return;

  boardBus(activeBus);

  Alert.alert("Journey Started", "You can now chat with bus staff.", [
    {
      text: "Open Chat",
      onPress: () => router.push("/(passenger)/chat"),
    },
  ]);
}

  function getMarkerDescription(bus: Bus) {
    const eta = bus.mlEtaMinutes ?? bus.etaMinutes;

    return `${bus.routeName} • ETA ${eta} min`;
  }

  return (
    <View style={styles.container}>
      

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

        {activeBus && (
          <Polyline
            coordinates={[location, activeBus.currentLocation]}
            strokeWidth={4}
            strokeColor={Colors.primary}
          />
        )}
      </MapView>

      <View style={styles.bottom}>
        <CustomInput
          placeholder="Search bus, route or station"
          value={search}
          onChangeText={setSearch}
        />

        {activeBus && (
          <View style={styles.nearest}>
            <Text style={styles.nearestTitle}>
              {selectedBus ? "Selected Bus" : "Nearest Bus"}
            </Text>

            <Text style={styles.nearestBus}>{activeBus.busNumber}</Text>

            <Text style={styles.nearestText}>{activeBus.routeName}</Text>

            <Text style={styles.nearestEta}>
              ETA {activeBus.mlEtaMinutes ?? activeBus.etaMinutes} min
            </Text>

            <CustomButton
              title="I'm Boarding This Bus"
              onPress={handleBoardBus}
            />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredBuses.map((bus) => (
            <MapBusCard
              key={bus.id}
              bus={bus}
              showMachineEta
              onPress={() => setSelectedBus(bus)}
            />
          ))}

          {filteredBuses.length === 0 && (
            <Text style={styles.empty}>No buses found.</Text>
          )}
        </ScrollView>
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
    marginBottom: 12,
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
