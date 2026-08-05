import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Bus } from "../../mock/buses";
import { Colors } from "../../theme/colors";

interface Props {
  bus: Bus;
  onPress?: () => void;
  showMachineEta?: boolean;
  selected?: boolean;
}

const statusStyles: Record<Bus["status"], { bg: string; color: string }> = {
  "On Route": { bg: "#DCFCE7", color: "#15803D" },
  Approaching: { bg: "#DBEAFE", color: Colors.primaryDark },
  Delayed: { bg: "#FEE2E2", color: "#B91C1C" },
};

export default function MapBusCard({
  bus,
  onPress,
  showMachineEta = false,
  selected = false,
}: Props) {
  const eta =
    showMachineEta && bus.mlEtaMinutes ? bus.mlEtaMinutes : bus.etaMinutes;
  const nextStop = bus.routeStations[0] ?? "Not available";
  const status = statusStyles[bus.status] ?? statusStyles["On Route"];

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={[styles.icon, selected && styles.iconSelected]}>
          <Ionicons
            name="bus"
            size={20}
            color={selected ? "#FFFFFF" : Colors.primary}
          />
        </View>

        <View style={styles.main}>
          <Text style={styles.bus}>{bus.busNumber}</Text>
          <Text style={styles.plate}>{bus.plateNumber}</Text>
        </View>

        <Text style={styles.eta}>{eta} min</Text>
      </View>

      <Text style={styles.route}>{bus.routeName}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.info}>Next: {nextStop}</Text>

        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {bus.status}
          </Text>
        </View>
      </View>

      <Text style={styles.info}>Distance: {bus.distanceKm.toFixed(1)} km</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },

  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    shadowOpacity: 0.12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconSelected: {
    backgroundColor: Colors.primary,
  },

  main: {
    flex: 1,
  },

  bus: {
    fontWeight: "800",
    fontSize: 16,
    color: Colors.text,
  },

  plate: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  eta: {
    color: Colors.primary,
    fontWeight: "900",
  },

  route: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  info: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 12,
  },
});
