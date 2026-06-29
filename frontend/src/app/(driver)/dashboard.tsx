import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
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

export default function DriverDashboardScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const bus = driver?.buses?.[0];

  const [tripStarted, setTripStarted] = useState(false);

  const todayName = dayOrder[new Date().getDay()];

  const todaysJourney = bus?.schedule.find(
    (entry) => entry.dayOfWeek === todayName,
  );

  const nextJourney = useMemo(() => {
    if (!bus) return null;

    const todayIndex = new Date().getDay();

    for (let offset = 1; offset <= 7; offset += 1) {
      const day = dayOrder[(todayIndex + offset) % 7];
      const match = bus.schedule.find((entry) => entry.dayOfWeek === day);

      if (match) {
        return { ...match, isTomorrow: offset === 1 };
      }
    }

    return null;
  }, [bus]);

  function handleTripToggle(value: boolean) {
    setTripStarted(value);

    if (value) {
      router.push("/(driver)/current-trip-live");
    }
  }

  const quickActions: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    screen: string;
  }[] = [
    {
      title: "Live Route",
      icon: "map-outline",
      screen: "/(driver)/routes",
    },
    {
      title: "Emergency",
      icon: "warning-outline",
      screen: "/(driver)/emergency-report",
    },
    {
      title: "Add Journey",
      icon: "calendar-outline",
      screen: "/(driver)/add-journey",
    },
    {
      title: "Profile",
      icon: "person-circle-outline",
      screen: "/(driver)/profile",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <PageHeader
          title="Driver Dashboard"
          subtitle="Welcome back, drive safely"
        />

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroTitle}>
              {todaysJourney?.routeName ?? "No journey scheduled today"}
            </Text>

            <Text style={styles.heroSubtitle}>
              Bus No. {bus?.numberPlate ?? "Not registered"}
            </Text>

            {!!todaysJourney && (
              <Text style={styles.heroTime}>
                Departure: {todaysJourney.departureTime}
              </Text>
            )}
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Trip Status</Text>

            <Switch value={tripStarted} onValueChange={handleTripToggle} />

            <Text
              style={[
                styles.statusText,
                { color: tripStarted ? "#16A34A" : "#EF4444" },
              ]}
            >
              {tripStarted ? "Trip Started" : "Trip Stopped"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.tripButton,
            { backgroundColor: tripStarted ? "#DC2626" : Colors.primary },
          ]}
          onPress={() => handleTripToggle(!tripStarted)}
        >
          <Ionicons
            name={tripStarted ? "stop-circle" : "play-circle"}
            color="#fff"
            size={24}
          />

          <Text style={styles.tripButtonText}>
            {tripStarted ? "Stop Current Trip" : "Start Trip"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.actionCard}
              onPress={() => router.push(item.screen as any)}
            >
              <Ionicons name={item.icon} size={28} color={Colors.primary} />
              <Text style={styles.actionTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Next Scheduled Journey</Text>

        <View style={styles.scheduleCard}>
          {nextJourney ? (
            <>
              <Text style={styles.scheduleRoute}>{nextJourney.routeName}</Text>
              <Text style={styles.scheduleText}>
                {nextJourney.isTomorrow ? "Tomorrow" : "Upcoming"} •{" "}
                {nextJourney.departureTime}
              </Text>
            </>
          ) : (
            <Text style={styles.scheduleText}>
              No upcoming journeys scheduled this week.
            </Text>
          )}
        </View>

        <View style={styles.safetyCard}>
          <Ionicons name="shield-checkmark" size={34} color="#16A34A" />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.safetyTitle}>Safety Reminder</Text>
            <Text style={styles.safetyText}>
              Always verify passengers, obey traffic rules and report
              emergencies immediately.
            </Text>
          </View>
        </View>
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

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    maxWidth: 180,
  },

  heroSubtitle: {
    marginTop: 6,
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },

  heroTime: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 14,
  },

  statusContainer: {
    alignItems: "center",
  },

  statusLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: "600",
  },

  statusText: {
    marginTop: 8,
    fontWeight: "800",
    fontSize: 14,
  },

  tripButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 26,
  },

  tripButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 17,
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
    marginTop: 8,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },

  actionTitle: {
    marginTop: 12,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },

  scheduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },

  scheduleRoute: {
    fontSize: 19,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 8,
  },

  scheduleText: {
    color: Colors.textSecondary,
    marginBottom: 4,
    fontSize: 14,
  },

  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
  },

  safetyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#065F46",
    marginBottom: 6,
  },

  safetyText: {
    color: "#047857",
    lineHeight: 20,
    fontSize: 14,
  },
});
