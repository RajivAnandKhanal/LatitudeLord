import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import * as journeyService from "../../services/journeyService";
import { BackendJourney } from "../../services/journeyService";
import * as busService from "../../services/busService";
import { Colors } from "../../theme/colors";

type TripRow = {
  id: string;
  busNumber: string;
  status: string;
  date: string;
  distanceKm: number | null;
  durationMinutes: number | null;
};

export default function TripsScreen() {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const journeys = await journeyService.getMyJourneys();
        const rows = await Promise.all(journeys.map(toTripRow));
        if (!cancelled) setTrips(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distanceKm ?? 0), 0);

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
            {totalDistance.toFixed(1)} km
          </Text>

          <Text style={styles.summaryLabel}>
            Total Distance
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Recent Journeys
      </Text>

      {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />}

      {!loading && trips.length === 0 && (
        <Text style={styles.emptyText}>
          No journeys yet — board a bus from the live map to start one.
        </Text>
      )}

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
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Distance
            </Text>

            <Text style={styles.value}>
              {trip.distanceKm != null ? `${trip.distanceKm.toFixed(1)} km` : "—"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Duration
            </Text>

            <Text style={styles.value}>
              {trip.durationMinutes != null ? `${Math.round(trip.durationMinutes)} min` : "—"}
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

async function toTripRow(journey: BackendJourney): Promise<TripRow> {
  const bus = await busService.getBusById(journey.bus).catch(() => null);

  return {
    id: journey._id,
    busNumber: bus ? `${bus.busNumber} (${bus.plateNumber})` : journey.bus,
    status: journey.status.charAt(0).toUpperCase() + journey.status.slice(1),
    date: new Date(journey.startedAt).toLocaleDateString(),
    distanceKm: journey.distanceKm,
    durationMinutes: journey.durationMinutes,
  };
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

  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
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