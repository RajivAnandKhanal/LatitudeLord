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

export default function AddJourneyScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const bus = driver?.buses?.[0];

  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");

  const [schedule, setSchedule] = useState<BackendDaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bus) {
      setLoading(false);
      return;
    }
    routeService
      .getScheduleByBus(bus.id)
      .then((r) => setSchedule(r.schedule))
      .catch(() => setSchedule([]))
      .finally(() => setLoading(false));
  }, [bus?.id]);

  async function saveJourney() {
    if (!bus) {
      Alert.alert("No bus registered", "Register a bus from your profile first.");
      return;
    }
    if (!route.trim() || !date.trim()) {
      Alert.alert("Missing details", "Enter a route and a date.");
      return;
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      Alert.alert("Invalid date", "Use the format YYYY-MM-DD.");
      return;
    }

    // Backend routes are a recurring weekly schedule (day → stations), not
    // one-off dated journeys, so this saves the given date's weekday.
    const day = WEEKDAYS[(parsedDate.getDay() + 6) % 7];
    const [from, to] = route.split(/ to |→/i).map((s) => s.trim());

    const newEntry: BackendDaySchedule = {
      day,
      stations: [
        { name: from || route.trim(), ...DEFAULT_LOCATION },
        {
          name: to || "Destination",
          lat: DEFAULT_LOCATION.latitude + 0.01,
          lng: DEFAULT_LOCATION.longitude + 0.01,
        },
      ],
    };

    const merged = [...schedule.filter((entry) => entry.day !== day), newEntry];

    setSaving(true);
    try {
      const result = await routeService.setSchedule(bus.id, merged);
      setSchedule(result.schedule);
      Alert.alert("Success", `Journey scheduled for ${day}.`);
      setRoute("");
      setDate("");
    } catch (err) {
      Alert.alert(
        "Couldn't save journey",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const scheduleByDay = new Map(schedule.map((entry) => [entry.day, entry]));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Add Journey"
          subtitle="Schedule Upcoming Journey"
          showBackButton
        />

        <View style={styles.card}>
          <Text style={styles.label}>Route</Text>
          <TextInput
            value={route}
            onChangeText={setRoute}
            placeholder="Ratnapark to Koteshwor"
            style={styles.input}
          />

          <Text style={styles.label}>Journey Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            disabled={saving}
            onPress={saveJourney}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Save Journey
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            This Week's Schedule
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            WEEKDAYS.map((day) => {
              const entry = scheduleByDay.get(day);
              return (
                <View key={day} style={styles.dayRow}>
                  <Text>{day}</Text>
                  {entry ? (
                    <Text style={styles.scheduled}>
                      {entry.stations[0]?.name} → {entry.stations[entry.stations.length - 1]?.name}
                    </Text>
                  ) : (
                    <Text style={styles.pending}>
                      No Journey Added
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background},
  content:{padding:20,paddingTop:56,paddingBottom:40},
  card:{
    backgroundColor:"#fff",
    padding:20,
    borderRadius:20,
    borderWidth:1,
    borderColor:Colors.border
  },
  label:{
    fontWeight:"700",
    marginTop:14,
    marginBottom:6,
    color:Colors.text
  },
  input:{
    height:52,
    borderRadius:14,
    backgroundColor:"#F8FAFC",
    borderWidth:1,
    borderColor:Colors.border,
    paddingHorizontal:14
  },
  button:{
    marginTop:24,
    height:54,
    borderRadius:16,
    backgroundColor:Colors.primary,
    justifyContent:"center",
    alignItems:"center"
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText:{
    color:"#fff",
    fontWeight:"800",
    fontSize:16
  },
  infoCard:{
    marginTop:24,
    backgroundColor:"#fff",
    borderRadius:20,
    padding:20,
    borderWidth:1,
    borderColor:Colors.border
  },
  infoTitle:{
    fontSize:18,
    fontWeight:"800",
    marginBottom:14
  },
  dayRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:"#eee"
  },
  pending:{
    color:"#EF4444",
    fontWeight:"600"
  },
  scheduled: {
    color: "#15803D",
    fontWeight: "700",
  },
});
