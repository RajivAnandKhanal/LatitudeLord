import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import ScreenContainer from "../../components/common/ScreenContainer";
import { Colors } from "../../theme/colors";

const LOCATION_PERMISSION_KEY = "latitudelord_location_permission_checked";

export default function LocationPermissionScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function continueToLanding() {
    await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, "true");
    router.replace("/(public)/landing");
  }

  async function requestPermission() {
    setLoading(true);
    setMessage("");

    try {
      const currentPermission = await Location.getForegroundPermissionsAsync();

      if (currentPermission.status === "granted") {
        await continueToLanding();
        return;
      }

      const requestedPermission =
        await Location.requestForegroundPermissionsAsync();

      if (requestedPermission.status !== "granted") {
        setMessage(
          "Location permission was not enabled. Nearby buses will use default map data until permission is allowed.",
        );
        await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, "true");
        return;
      }

      await continueToLanding();
    } catch {
      setMessage("Unable to request location permission. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={54} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Enable Location</Text>

        <Text style={styles.description}>
          LatitudeLord uses your location to show nearby buses and estimate bus
          arrival times.
        </Text>

        {!!message && <Text style={styles.message}>{message}</Text>}

        <CustomButton
          title="Allow Location Access"
          loading={loading}
          disabled={loading}
          onPress={requestPermission}
        />

        {!!message && (
          <View style={styles.secondaryAction}>
            <CustomButton title="Continue" onPress={continueToLanding} />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#DBEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: Colors.text,
  },

  description: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 28,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontSize: 15,
  },

  message: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    lineHeight: 20,
    fontWeight: "600",
  },

  secondaryAction: {
    marginTop: 12,
  },
});
