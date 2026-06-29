import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BusCard from "../../components/common/BusCard";
import PageHeader from "../../components/common/PageHeader";
import QuickAction from "../../components/common/QuickAction";
import SectionHeader from "../../components/common/SectionHeader";
import { Bus, buses } from "../../mock/buses";
import { Colors } from "../../theme/colors";

export default function PassengerHomeScreen() {
  const [station, setStation] = useState("");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const filteredBuses = useMemo(() => {
    const query = station.trim().toLowerCase();

    if (!query) {
      return buses;
    }

    return buses.filter((bus) =>
      bus.routeStations.some((item) => item.toLowerCase().includes(query)),
    );
  }, [station]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PageHeader
          title="Passenger Home"
          subtitle="Nearby buses and support"
        />

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Find your next bus</Text>
          <Text style={styles.heroText}>
            Track buses, chat with staff and get support when needed.
          </Text>
        </View>



        <TextInput
          placeholder="Search station, example: Koteshwor"
          placeholderTextColor={Colors.textSecondary}
          style={styles.search}
          value={station}
          onChangeText={setStation}
        />

        {selectedBus && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{selectedBus.busNumber}</Text>
            <Text style={styles.detailText}>{selectedBus.routeName}</Text>
            <Text style={styles.detailEta}>
              Estimated arrival:{" "}
              {selectedBus.mlEtaMinutes ?? selectedBus.etaMinutes} min
            </Text>
            <Text style={styles.detailText}>
              ETA uses GPS and machine-learning data when backend data is
              available.
            </Text>

            <TouchableOpacity
              style={styles.mapButton}
              activeOpacity={0.85}
              onPress={() => router.push("/(passenger)/map")}
            >
              <Text style={styles.mapButtonText}>Open Live Map</Text>
            </TouchableOpacity>
          </View>
        )}

        <SectionHeader title="Nearby Buses" />

        {filteredBuses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            showMachineEta
            onPress={() =>
              router.push({
                pathname: "/(passenger)/bus-details",
                params: {
                  busId: bus.id,
                },
              })
            }
          />
        ))}

        {filteredBuses.length === 0 && (
          <Text style={styles.empty}>No buses found for this station.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 36,
  },

  hero: {
    backgroundColor: "#DBEAFE",
    borderRadius: 18,
    padding: 20,
    marginVertical: 20,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  heroText: {
    marginTop: 6,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  actions: {
    flexDirection: "row",
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#FFFFFF",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },

  detailText: {
    marginTop: 6,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  detailEta: {
    marginTop: 10,
    color: Colors.primary,
    fontWeight: "800",
  },

  mapButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  mapButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  empty: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
