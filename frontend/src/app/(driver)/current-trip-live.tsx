import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import LeafletMap, {
  LeafletMapHandle,
} from "../../components/common/LeafletMap";
import { useAuth } from "../../hooks/useAuth";
import { useDriverTrip } from "../../hooks/useDriverTrip";
import { connectSocket } from "../../services/socket";
import { pingLocation } from "../../services/liveTrackingSocket";
import * as busLocationService from "../../services/busLocationService";
import {
  watchLivePosition,
  LivePosition,
} from "../../services/locationService";
import { Colors } from "../../theme/colors";
import { DriverUser } from "../../types/auth";

export default function CurrentTripLiveScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const bus = driver?.buses?.[0];
  const { tripStarted, startTrip, endTrip } = useDriverTrip();

  const [position, setPosition] = useState<LivePosition | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);
  const mapRef = useRef<LeafletMapHandle>(null);

  useEffect(() => {
    // Only start watching/broadcasting GPS once a trip is actually active.
    if (!bus || !tripStarted) return;

    let cancelled = false;

    (async () => {
      try {
        await connectSocket();
        const stop = await watchLivePosition(async (pos) => {
          if (cancelled) return;
          setPosition(pos);
          // Keep the map centered on the driver as they move — markers
          // update on their own, but the view itself only ever pointed at
          // the first GPS fix, so without this the driver's dot drifts off
          // screen after the first update.
          mapRef.current?.setView(pos.latitude, pos.longitude);

          const ack = await pingLocation(bus.id, {
            lat: pos.latitude,
            lng: pos.longitude,
            speedKmh: pos.speedKmh,
            heading: pos.heading ?? undefined,
          });

          if (ack.success) {
            setBroadcasting(true);
          } else {
            // Socket path unavailable — fall back to the REST endpoint.
            await busLocationService
              .pushLocation(bus.id, {
                lat: pos.latitude,
                lng: pos.longitude,
                speedKmh: pos.speedKmh,
                heading: pos.heading ?? undefined,
              })
              .then(() => setBroadcasting(true))
              .catch(() => setBroadcasting(false));
          }
        });
        stopWatchRef.current = stop;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not access location.",
        );
      }
    })();

    return () => {
      cancelled = true;
      stopWatchRef.current?.();
    };
  }, [bus?.id, tripStarted]);

  function confirmEndJourney() {
    Alert.alert(
      "End Journey?",
      "This will stop broadcasting your live location.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Journey",
          style: "destructive",
          onPress: () => {
            stopWatchRef.current?.();
            endTrip();
            setPosition(null);
            setBroadcasting(false);
          },
        },
      ],
    );
  }

  // No trip in progress yet — offer a way to start one instead of an empty
  // live-tracking screen. Dashboard, alerts, etc. all stay reachable via the
  // footer tabs since this is just one tab among them.
  if (!tripStarted) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <PageHeader title="Current Journey" subtitle="No active trip" />

          <View style={styles.emptyCard}>
            <Ionicons
              name="navigate-circle-outline"
              size={48}
              color={Colors.primary}
            />
            <Text style={styles.emptyTitle}>No trip in progress</Text>
            <Text style={styles.emptyText}>
              Start a trip to see live journey info here, including your current
              location on the map.
            </Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startTrip()}
            >
              <Ionicons name="play-circle" color="#fff" size={22} />
              <Text style={styles.stopText}>Start Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader title="Current Journey" subtitle="Live Trip Status" />

        <View style={styles.statusCard}>
          <Text style={styles.bus}>
            {bus
              ? bus.companyBusNumber && bus.companyBusNumber !== bus.numberPlate
                ? `${bus.companyBusNumber} • ${bus.numberPlate}`
                : bus.numberPlate
              : "No bus registered"}
          </Text>

          <View style={styles.liveRow}>
            <View
              style={[styles.liveDot, !broadcasting && styles.liveDotOff]}
            />
            <Text style={styles.liveText}>
              {error
                ? error
                : broadcasting
                  ? "Broadcasting live location"
                  : "Connecting…"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Live Map</Text>
          <View style={styles.mapBox}>
            {position ? (
              // <LeafletMap
              //   ref={mapRef}
              //   center={{ lat: position.latitude, lng: position.longitude }}
              //   zoom={16}
              //   markers={[
              //     {
              //       id: "self",
              //       lat: position.latitude,
              //       lng: position.longitude,
              //       title: bus?.companyBusNumber ?? "Your bus",
              //       color: "#22C55E",
              //     },
              //   ]}
              // />
              <LeafletMap
                ref={mapRef}
                center={{ lat: position.latitude, lng: position.longitude }}
                zoom={16}
                markers={[
                  {
                    id: "self",
                    lat: position.latitude,
                    lng: position.longitude,
                    title: bus?.companyBusNumber ?? "Your bus",
                    color: "#22C55E",
                    pulse: true,
                  },
                ]}
              />
            ) : (
              <Text style={styles.stationName}>Waiting for GPS fix…</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Current Position</Text>

          {position ? (
            <>
              <View style={styles.station}>
                <Ionicons name="location" size={18} color={Colors.primary} />
                <Text style={styles.stationName}>
                  {position.latitude.toFixed(5)},{" "}
                  {position.longitude.toFixed(5)}
                </Text>
              </View>
              <View style={styles.station}>
                <Ionicons
                  name="speedometer-outline"
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.stationName}>
                  {position.speedKmh.toFixed(1)} km/h
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.stationName}>Waiting for GPS fix…</Text>
          )}
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={confirmEndJourney}>
          <Ionicons name="stop-circle" size={22} color="#fff" />

          <Text style={styles.stopText}>End Journey</Text>
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

  statusCard: {
    backgroundColor: "#DCFCE7",
    padding: 22,
    borderRadius: 20,
    marginBottom: 20,
  },

  bus: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  route: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    marginRight: 10,
  },

  liveDotOff: {
    backgroundColor: "#F59E0B",
  },

  liveText: {
    fontWeight: "700",
    color: "#15803D",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },

  section: {
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 16,
    color: Colors.text,
  },

  mapBox: {
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
  },

  station: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  stationName: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },

  stopButton: {
    marginTop: 24,
    height: 56,
    backgroundColor: "#DC2626",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  stopText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    marginLeft: 10,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    marginTop: 20,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: "800",
    color: Colors.text,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  startButton: {
    marginTop: 22,
    height: 54,
    minWidth: 180,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
  },
});
