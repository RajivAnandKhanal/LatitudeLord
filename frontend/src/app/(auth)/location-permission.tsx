import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import ScreenContainer from "../../components/common/ScreenContainer";
import { Colors } from "../../theme/colors";

export default function LocationPermissionScreen() {
  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Location Required", "Please enable location services.");
      return;
    }

    router.replace("/landing");
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Ionicons name="location" size={90} color={Colors.primary} />

        <Text style={styles.title}>Welcome to LatitudeLord</Text>

        <Text style={styles.description}>
          Enable location access to discover nearby buses, routes and estimated
          arrival times.
        </Text>

        <CustomButton title="Enable Location" onPress={requestPermission} />
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

  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 24,
    color: Colors.text,
  },

  description: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 40,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
