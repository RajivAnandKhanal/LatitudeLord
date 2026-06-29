import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { router } from "expo-router";
import { useAuth } from "../hooks/useAuth";

import { Colors } from "../theme/colors";

export default function HomeButton() {
  const { user } = useAuth();

  function navigateHome() {
    if (!user) {
      router.replace("/(guest)/home");
      return;
    }

    if (user.role === "passenger") {
      router.replace("/(passenger)/home");
      return;
    }

    if (user.role === "driver") {
      router.replace("/(driver)/dashboard");
      return;
    }

    router.replace("/(public)/landing");
  }

  return (
    <TouchableOpacity style={styles.button} onPress={navigateHome}>
      <Text style={styles.text}>Dashboard</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  text: {
    color: "#FFF",
    fontWeight: "700",
  },
});
