
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";

export default function AuthHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LatitudeLord</Text>

      <Text style={styles.subtitle}>Smart Bus Tracking for Nepal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },

  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
