import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Bus } from "../../mock/buses";
import { Colors } from "../../theme/colors";

interface Props {
  bus: Bus;
  onPress: () => void;
  showMachineEta?: boolean;
}

export default function BusCard({
  bus,
  onPress,
  showMachineEta = false,
}: Props) {
  const eta =
    showMachineEta && bus.mlEtaMinutes ? bus.mlEtaMinutes : bus.etaMinutes;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name="bus" size={24} color={Colors.primary} />
        </View>

        <View style={styles.main}>
          <Text style={styles.number}>{bus.busNumber}</Text>
          <Text style={styles.plate}>{bus.plateNumber}</Text>
          <Text style={styles.route}>{bus.routeName}</Text>
        </View>

        <View style={styles.etaBox}>
          <Text style={styles.eta}>{eta} min</Text>
          <Text style={styles.etaLabel}>ETA</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.meta}>{bus.distanceKm.toFixed(1)} km away</Text>
        <Text style={styles.status}>{bus.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  main: {
    flex: 1,
  },

  number: {
    fontWeight: "800",
    fontSize: 16,
    color: Colors.text,
  },

  plate: {
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },

  route: {
    color: Colors.textSecondary,
    marginTop: 4,
  },

  etaBox: {
    alignItems: "flex-end",
  },

  eta: {
    color: Colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },

  etaLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  meta: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  status: {
    color: Colors.success,
    fontWeight: "700",
  },
});
