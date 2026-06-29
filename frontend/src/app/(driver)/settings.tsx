import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../theme/colors";

export default function DriverSettingsScreen() {
  const { logout } = useAuth();

  function confirmLogout() {
    Alert.alert("Logout?", "You will be signed out of your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)/landing");
        },
      },
    ]);
  }

  function Item(
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress: () => void,
  ) {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader title="Settings" subtitle="Account & app controls" />

        <Text style={styles.sectionTitle}>Account</Text>

        {Item(
          "create-outline",
          "Edit Profile",
          "Name, phone, photo, bus and staff details",
          () => router.push("/(driver)/profile"),
        )}

        {Item(
          "lock-closed-outline",
          "Change Password",
          "Update your account password",
          () => router.push("/change-password"),
        )}

        <Text style={styles.sectionTitle}>Help</Text>

        {Item(
          "help-circle-outline",
          "Support",
          "Need assistance?",
          () => router.push("/(driver)/support"),
        )}

        {Item(
          "chatbox-ellipses-outline",
          "Bug Report / Feedback",
          "Send anonymous feedback",
          () => router.push("/feedback"),
        )}

        {Item(
          "information-circle-outline",
          "About Project Developers",
          "App version & project info",
          () => router.push("/about"),
        )}

        <TouchableOpacity style={styles.logout} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 12,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  info: { flex: 1, marginLeft: 14 },
  title: { fontWeight: "700", fontSize: 16, color: Colors.text },
  subtitle: { marginTop: 3, color: Colors.textSecondary },
  logout: {
    marginTop: 10,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },
});
