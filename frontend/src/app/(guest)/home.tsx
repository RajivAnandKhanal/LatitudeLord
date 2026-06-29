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
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/common/AppHeader";
import AppLogo from "../../components/common/AppLogo";
import BusCard from "../../components/common/BusCard";
import { Bus, buses } from "../../mock/buses";
import { Colors } from "../../theme/colors";

export default function GuestHomeScreen() {
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
    <SafeAreaView style={styles.container}>
      <AppHeader title="Guest Mode" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppLogo />

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Nearby Buses</Text>
          <Text style={styles.heroText}>
            Search by station and select a bus to see its estimated arrival
            time.
          </Text>
        </View>

        <TextInput
          placeholder="Search station, example: Kalanki"
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
              Estimated arrival: {selectedBus.etaMinutes} min
            </Text>
            <Text style={styles.detailText}>
              Last station: {selectedBus.lastStation}
            </Text>

            <TouchableOpacity
              style={styles.mapButton}
              activeOpacity={0.85}
              onPress={() => router.push("/(guest)/map")}
            >
              <Text style={styles.mapButtonText}>View On Map</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Available Buses</Text>

        {filteredBuses.map((bus) => (
          <BusCard key={bus.id} bus={bus} onPress={() => setSelectedBus(bus)} />
        ))}

        {filteredBuses.length === 0 && (
          <Text style={styles.empty}>No buses found for this station.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 36,
  },

  hero: {
    marginVertical: 24,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.text,
  },

  heroText: {
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },

  search: {
    backgroundColor: "#FFFFFF",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
  },

  empty: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
