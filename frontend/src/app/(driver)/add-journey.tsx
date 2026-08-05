import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import * as routeService from "../../services/routeService";
import { BackendDay, BackendDaySchedule } from "../../services/routeService";
import { DEFAULT_LOCATION } from "../../services/locationService";
import { Colors } from "../../theme/colors";
import { DriverUser } from "../../types/auth";

const WEEKDAYS: BackendDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// One editable row per weekday — "from" and "to" station names. Blank rows
// are simply left out of the saved schedule for that day.
type DayDraft = { from: string; to: string };

function emptyDrafts(): Record<BackendDay, DayDraft> {
  return Object.fromEntries(
    WEEKDAYS.map((day) => [day, { from: "", to: "" }]),
  ) as Record<BackendDay, DayDraft>;
}

export default function WeeklyRouteScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const bus = driver?.buses?.[0];

  const [drafts, setDrafts] =
    useState<Record<BackendDay, DayDraft>>(emptyDrafts());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bus) {
      setLoading(false);
      return;
    }
    routeService
      .getScheduleByBus(bus.id)
      .then((r) => {
        const next = emptyDrafts();
        r.schedule.forEach((entry) => {
          const first = entry.stations[0]?.name ?? "";
          const last = entry.stations[entry.stations.length - 1]?.name ?? "";
          next[entry.day] = { from: first, to: last };
        });
        setDrafts(next);
      })
      .catch(() => setDrafts(emptyDrafts()))
      .finally(() => setLoading(false));
  }, [bus?.id]);

  function updateDay(day: BackendDay, field: keyof DayDraft, value: string) {
    setDrafts((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  async function saveWeek() {
    if (!bus) {
      Alert.alert(
        "No bus registered",
        "Register a bus from your profile first.",
      );
      return;
    }

    // Build the full week's schedule from whichever days have both a
    // "from" and "to" filled in — days left blank simply have no journey.
    const schedule: BackendDaySchedule[] = WEEKDAYS.filter(
      (day) => drafts[day].from.trim() && drafts[day].to.trim(),
    ).map((day) => ({
      day,
      stations: [
        { name: drafts[day].from.trim(), ...DEFAULT_LOCATION },
        {
          name: drafts[day].to.trim(),
          lat: DEFAULT_LOCATION.latitude + 0.01,
          lng: DEFAULT_LOCATION.longitude + 0.01,
        },
      ],
    }));

    setSaving(true);
    try {
      const result = await routeService.setSchedule(bus.id, schedule);
      const next = emptyDrafts();
      result.schedule.forEach((entry) => {
        const first = entry.stations[0]?.name ?? "";
        const last = entry.stations[entry.stations.length - 1]?.name ?? "";
        next[entry.day] = { from: first, to: last };
      });
      setDrafts(next);
      Alert.alert("Saved", "Your weekly route has been updated.");
    } catch (err) {
      Alert.alert(
        "Couldn't save route",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Weekly Route"
          subtitle="Set your route for each day"
          showBackButton
        />

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 30 }} />
        ) : !bus ? (
          <Text style={styles.emptyText}>
            Register a bus from your profile first.
          </Text>
        ) : (
          <>
            {WEEKDAYS.map((day) => (
              <View key={day} style={styles.card}>
                <Text style={styles.dayLabel}>{day}</Text>

                <Text style={styles.label}>From</Text>
                <TextInput
                  value={drafts[day].from}
                  onChangeText={(v) => updateDay(day, "from", v)}
                  placeholder="Ratnapark"
                  style={styles.input}
                />

                <Text style={styles.label}>To</Text>
                <TextInput
                  value={drafts[day].to}
                  onChangeText={(v) => updateDay(day, "to", v)}
                  placeholder="Koteshwor"
                  style={styles.input}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, saving && styles.buttonDisabled]}
              disabled={saving}
              onPress={saveWeek}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Weekly Route</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  dayLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  label: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
    color: Colors.text,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  button: {
    marginTop: 8,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: 8,
  },
});
