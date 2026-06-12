import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import AppLogo from "../../components/common/AppLogo";
import FeatureCard from "../../components/common/FeatureCard";
import { Colors } from "../../theme/colors";

export default function LandingScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppLogo />
      </View>

      <LinearGradient colors={["#2563EB", "#3B82F6"]} style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nepal Smart Transport Platform</Text>
        </View>

        <Text style={styles.quote}>
          Track the Bus,
          {"\n"}
          Remove the Rush
        </Text>

        <Text style={styles.heroDescription}>
          Real-time bus tracking, arrival prediction, route discovery and
          passenger support built for Nepal.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>GPS</Text>
            <Text style={styles.statLabel}>Tracking</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>ETA</Text>
            <Text style={styles.statLabel}>Prediction</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Core Features</Text>

      <View style={styles.gridRow}>
        <FeatureCard icon="bus" title="Nearby Buses" />
        <FeatureCard icon="time" title="Live ETA" />
      </View>

      <View style={styles.gridRow}>
        <FeatureCard icon="map" title="Route Tracking" />
        <FeatureCard icon="chatbubbles" title="Chat Staff" />
      </View>

      <View style={styles.gridRow}>
        <FeatureCard icon="location" title="GPS Tracking" />
      </View>

      <TouchableOpacity
        style={styles.guestButton}
        activeOpacity={0.9}
        onPress={() => router.push("/(guest)/home")}
      >
        <Ionicons name="compass" size={20} color={Colors.text} />
        <Text style={styles.guestText}>Open as Guest</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.authButton}
        activeOpacity={0.9}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.authText}>Login / Register</Text>
      </TouchableOpacity>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Why LatitudeLord?</Text>

        <Text style={styles.aboutDescription}>
          LatitudeLord helps passengers discover nearby buses, estimate arrival
          times, communicate with staff and travel with confidence.
        </Text>
      </View>

      <Text style={styles.version}>LatitudeLord v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },

  hero: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 24,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  quote: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 18,
    lineHeight: 40,
  },

  heroDescription: {
    color: "#E0F2FE",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 22,
    justifyContent: "space-between",
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    paddingVertical: 14,
    width: "31%",
    alignItems: "center",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  statLabel: {
    color: "#E0F2FE",
    marginTop: 4,
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },

  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  guestButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },

  guestText: {
    marginLeft: 8,
    fontWeight: "700",
    color: Colors.text,
  },

  authButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  authText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  version: {
    textAlign: "center",
    marginTop: 18,
    color: Colors.textSecondary,
  },

  aboutCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
  },

  aboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },

  aboutDescription: {
    color: Colors.textSecondary,
    lineHeight: 22,
    fontSize: 14,
  },
});
