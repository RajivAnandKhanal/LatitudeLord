import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Bus } from "../../mock/buses";
import { Colors } from "../../theme/colors";

interface Props {
  bus: Bus;
  onPress?: () => void;
  showMachineEta?: boolean;
}

export default function MapBusCard({
  bus,
  onPress,
  showMachineEta = false,
}: Props) {
  const eta =
    showMachineEta && bus.mlEtaMinutes ? bus.mlEtaMinutes : bus.etaMinutes;
  const nextStop = bus.routeStations[0] ?? "Not available";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <Ionicons name="bus" size={20} color={Colors.primary} />
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
        <Text style={styles.status}>{bus.status}</Text>
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
    marginTop: 8,
  },

  info: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  status: {
    color: Colors.success,
    fontWeight: "700",
  },
});
