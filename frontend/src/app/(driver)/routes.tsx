import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { findBusByPlate } from "../../mock/buses";
import { Colors } from "../../theme/colors";
import { DayOfWeek, DriverUser } from "../../types/auth";

const dayOrder: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function DriverRoutesScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const driverBus = driver?.buses?.[0];
  const liveBus = driverBus ? findBusByPlate(driverBus.numberPlate) : undefined;

  const todayName = dayOrder[new Date().getDay()];
  const todaysJourney = driverBus?.schedule.find(
    (entry) => entry.dayOfWeek === todayName,
  );

  const upcoming = useMemo(() => {
    if (!driverBus) return [];

    const todayIndex = new Date().getDay();
    const result: { dayLabel: string; routeName: string; departureTime: string }[] = [];

    for (let offset = 1; offset <= 6; offset += 1) {
      const day = dayOrder[(todayIndex + offset) % 7];
      const match = driverBus.schedule.find((entry) => entry.dayOfWeek === day);

      if (match) {
        result.push({
          dayLabel: offset === 1 ? "Tomorrow" : day.charAt(0).toUpperCase() + day.slice(1),
          routeName: match.routeName,
          departureTime: match.departureTime,
        });
      }
    }

    return result;
  }, [driverBus]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PageHeader title="Routes" subtitle="Current & scheduled journeys" />

        <View style={styles.currentCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTitle}>
                {todaysJourney?.routeName ?? "No journey today"}
              </Text>

              <Text style={styles.busNo}>
                Bus {driverBus?.numberPlate ?? "Not registered"}
              </Text>
            </View>

            {!!todaysJourney && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>TODAY</Text>
              </View>
            )}
          </View>

          {!!todaysJourney && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
              <Text style={styles.info}>
                Departure: {todaysJourney.departureTime}
              </Text>
            </View>
          )}

          {!!liveBus && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} />
              <Text style={styles.info}>
                Status: {liveBus.status} • ETA {liveBus.etaMinutes} min
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Route Stations</Text>

        <View style={styles.timelineCard}>
          {liveBus ? (
            liveBus.routeStations.map((station, index) => {
              const isLast = station === liveBus.lastStation;
              const isPast = index < liveBus.routeStations.length / 2;

              return (
                <View key={station} style={styles.stationRow}>
                  <View
                    style={[
                      styles.circle,
                      isPast && styles.completed,
                      !isPast && !isLast && styles.current,
                    ]}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.stationName}>{station}</Text>
                    {isLast && (
                      <Text style={styles.stationStatus}>FINAL STOP</Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>
              No live route data available for this bus yet.
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Journeys This Week</Text>

        {upcoming.length > 0 ? (
          upcoming.map((item) => (
            <View key={`${item.dayLabel}-${item.departureTime}`} style={styles.futureCard}>
              <Ionicons name="calendar-outline" size={26} color={Colors.primary} />

              <View style={{ marginLeft: 14 }}>
                <Text style={styles.futureRoute}>{item.routeName}</Text>
                <Text style={styles.futureTime}>
                  {item.dayLabel} • {item.departureTime}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No other journeys scheduled this week.
          </Text>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },

  currentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  routeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },

  busNo: {
    marginTop: 6,
    color: Colors.primary,
    fontWeight: "700",
  },

  liveBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  liveText: {
    color: "#15803D",
    fontWeight: "800",
    fontSize: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  info: {
    marginLeft: 10,
    color: Colors.textSecondary,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
    marginTop: 6,
  },

  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },

  stationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D1D5DB",
    marginTop: 3,
    marginRight: 16,
  },

  completed: {
    backgroundColor: "#22C55E",
  },

  current: {
    backgroundColor: Colors.primary,
  },

  stationName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  stationStatus: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  futureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },

  futureRoute: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  futureTime: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: 8,
  },
});
