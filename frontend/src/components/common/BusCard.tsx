
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../theme/colors";

interface Props {
  bus: any;
  onPress: () => void;
}

export default function BusCard({ bus, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name="bus" size={24} color={Colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.number}>{bus.busNumber}</Text>

          <Text style={styles.route}>{bus.route}</Text>
        </View>

        <Text style={styles.eta}>{bus.eta}</Text>
      </View>

      <View style={styles.bottom}>
        <Text>{bus.distance}</Text>
        <Text style={styles.status}>{bus.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  number: {
    fontWeight: "700",
    fontSize: 16,
  },

  route: {
    color: Colors.textSecondary,
  },

  eta: {
    color: Colors.primary,
    fontWeight: "800",
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  status: {
    color: "#22C55E",
    fontWeight: "600",
  },
});
