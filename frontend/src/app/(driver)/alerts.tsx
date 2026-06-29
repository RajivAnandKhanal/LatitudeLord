import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

const alerts = [
  {
    id: "1",
    type: "High",
    icon: "warning",
    color: "#EF4444",
    title: "Road Blocked",
    description: "Koteshwor road is temporarily closed.",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "Medium",
    icon: "car",
    color: "#F59E0B",
    title: "Heavy Traffic",
    description: "Slow traffic at Kalanki Ring Road.",
    time: "8 min ago",
  },
  {
    id: "3",
    type: "Low",
    icon: "rainy",
    color: "#3B82F6",
    title: "Weather Alert",
    description: "Light rainfall expected along your route.",
    time: "15 min ago",
  },
  {
    id: "4",
    type: "Info",
    icon: "information-circle",
    color: "#10B981",
    title: "Journey Reminder",
    description: "Next scheduled trip starts at 2:30 PM.",
    time: "Today",
  },
];

export default function AlertsScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <PageHeader
          title="Alerts"
          subtitle="Traffic, weather & emergencies"
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Critical</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>2</Text>
            <Text style={styles.summaryLabel}>Traffic</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>4</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Latest Alerts</Text>

        {alerts.map((item) => (
          <View key={item.id} style={styles.alertCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color + "22" },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.color}
              />
            </View>

            <View style={styles.alertBody}>
              <View style={styles.row}>
                <Text style={styles.alertTitle}>{item.title}</Text>

                <Text
                  style={[
                    styles.badge,
                    { color: item.color },
                  ]}
                >
                  {item.type}
                </Text>
              </View>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.time}>
                {item.time}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(driver)/emergency-report")}
        >
          <Ionicons
            name="warning-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.buttonText}>
            Report Emergency
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondary]}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={Colors.primary}
          />
          <Text
            style={[
              styles.buttonText,
              { color: Colors.primary },
            ]}
          >
            Refresh Alerts
          </Text>
        </TouchableOpacity>
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
    paddingTop: 56,
    paddingBottom: 40,
  },

  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 22,
  },

  summaryItem: {
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.primary,
  },

  summaryLabel: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
  },

  alertCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  alertBody: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alertTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  badge: {
    fontWeight: "700",
    fontSize: 13,
  },

  description: {
    marginTop: 6,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  time: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
  },

  button: {
    marginTop: 18,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  buttonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});