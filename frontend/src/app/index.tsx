import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../hooks/useAuth";
import { Colors } from "../theme/colors";

const LOCATION_PERMISSION_KEY = "latitudelord_location_permission_checked";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    async function decideStartScreen() {
      if (loading) {
        return;
      }

      if (user?.role === "passenger") {
        router.replace("/(passenger)/home");
        return;
      }

      if (user?.role === "driver") {
        router.replace("/(driver)/dashboard");
        return;
      }

      const checked = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);

      if (checked === "true") {
        router.replace("/(public)/landing");
        return;
      }

      router.replace("/(auth)/location-permission");
    }

    decideStartScreen();
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
