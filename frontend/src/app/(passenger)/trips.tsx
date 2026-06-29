import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

const trips = [
  {
    id: "1",
    busNumber: "BA-12-KHA-1234",
    route: "Koteshwor → Ratnapark",
    fare: 25,
    date: "24 Jun 2026",
    status: "Completed",
  },
  {
    id: "2",
    busNumber: "BA-14-KHA-4587",
    route: "Kalanki → New Bus Park",
    fare: 30,
    date: "23 Jun 2026",
    status: "Completed",
  },
  {
    id: "3",
    busNumber: "BA-10-KHA-8899",
    route: "Bhaktapur → Koteshwor",
    fare: 20,
    date: "22 Jun 2026",
    status: "Completed",
  },
];

export default function TripsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="My Trips"
        subtitle="Journey History"
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {trips.length}
          </Text>

          <Text style={styles.summaryLabel}>
            Total Trips
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            Rs. {trips.reduce((sum, trip) => sum + trip.fare, 0)}
          </Text>

          <Text style={styles.summaryLabel}>
            Total Spent
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Recent Journeys
      </Text>

      {trips.map((trip) => (
        <View
          key={trip.id}
          style={styles.tripCard}
        >
          <View style={styles.topRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="bus-outline"
                size={24}
                color={Colors.primary}
              />
            </View>

            <View style={styles.routeContainer}>
              <Text style={styles.busNumber}>
                {trip.busNumber}
              </Text>

              <Text style={styles.route}>
                {trip.route}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Fare Paid
            </Text>

            <Text style={styles.value}>
              Rs. {trip.fare}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Date
            </Text>

            <Text style={styles.value}>
              {trip.date}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Status
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {trip.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.primary,
  },

  summaryLabel: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
  },

  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  topRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  routeContainer: {
    flex: 1,
  },

  busNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },

  route: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  value: {
    color: Colors.text,
    fontWeight: "700",
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: "#15803D",
    fontWeight: "800",
    fontSize: 12,
  },
});