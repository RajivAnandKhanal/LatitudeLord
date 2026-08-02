import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useBusDetails } from "../../hooks/useBusDetails";
import { Colors } from "../../theme/colors";

export default function BusDetailsScreen() {
  const { busId } = useLocalSearchParams<{ busId: string }>();

  const { bus, loading, error } = useBusDetails(busId);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!bus) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <PageHeader title="Bus Details" showBackButton />
        <Text style={styles.value}>{error ?? "Bus not found."}</Text>
      </ScrollView>
    );
  }

  const eta = bus.mlEtaMinutes ?? bus.etaMinutes;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title="Bus Details" subtitle={bus.routeName} showBackButton />

      <View style={styles.hero}>
        <Text style={styles.title}>{bus.busNumber}</Text>

        <Text style={styles.route}>{bus.routeName}</Text>

        <Text style={styles.plate}>{bus.plateNumber}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Driver</Text>
        <Text style={styles.value}>{bus.driverName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Bus Staff</Text>
        <Text style={styles.value}>{bus.staffName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ETA</Text>
        <Text style={styles.value}>{eta} Minutes</Text>
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => router.push("/(passenger)/map")}
      >
        <Text style={styles.primaryText}>Track Bus</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
  },

  hero: {
    backgroundColor: "#DBEAFE",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
  },

  route: {
    marginTop: 8,
  },

  plate: {
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  label: {
    color: Colors.textSecondary,
  },

  value: {
    fontWeight: "800",
    marginTop: 5,
  },

  primary: {
    backgroundColor: Colors.primary,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 10,
  },

  primaryText: {
    color: "#FFF",
    fontWeight: "800",
  },
});
