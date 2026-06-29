import { ScrollView, StyleSheet, Text, View } from "react-native";

import AppLogo from "../../components/common/AppLogo";
import { buses } from "../../mock/buses";
import { Colors } from "../../theme/colors";

export default function GuestBusDetailsScreen() {
  const bus = buses[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AppLogo />

      <View style={styles.hero}>
        <Text style={styles.busName}>{bus.busNumber}</Text>
        <Text style={styles.route}>{bus.routeName}</Text>
        <Text style={styles.status}>{bus.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Plate Number</Text>
        <Text style={styles.value}>{bus.plateNumber}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Estimated Arrival</Text>
        <Text style={styles.value}>{bus.etaMinutes} minutes</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Route</Text>
        <Text style={styles.value}>{bus.routeStations.join(" - ")}</Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Guest Access</Text>
        <Text style={styles.noticeText}>
          Login as a passenger to use bus tracking, chat, support, profile,
          settings and feedback.
        </Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },

  hero: {
    backgroundColor: "#DBEAFE",
    borderRadius: 18,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
  },

  busName: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },

  route: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: "700",
  },

  status: {
    marginTop: 12,
    color: Colors.success,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  label: {
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: "700",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 22,
  },

  noticeCard: {
    marginTop: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 20,
  },

  noticeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },

  noticeText: {
    marginTop: 10,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
});
