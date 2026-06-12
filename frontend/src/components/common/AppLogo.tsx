
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../theme/colors";

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="bus" size={30} color="#FFFFFF" />
      </View>

      <View>
        <Text style={styles.title}>LatitudeLord</Text>

        <Text style={styles.subtitle}>Smart Bus Tracking Nepal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.primary,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
