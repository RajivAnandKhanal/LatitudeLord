import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  title: string;
}

export default function PageHeader({ title }: Props) {
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.logoSection}>
        <Text style={styles.logo}>LatitudeLord</Text>

        <Text style={styles.subtitle}>Smart Bus Tracking Nepal</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  logoSection: {
    marginBottom: 20,
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
  },

  subtitle: {
    color: Colors.textSecondary,
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
  },
});
