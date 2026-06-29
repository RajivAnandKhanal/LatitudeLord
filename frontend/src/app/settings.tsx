import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import CustomButton from "../components/common/CustomButton";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../theme/colors";

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/(public)/landing");
  }

  function confirmLogout() {
    Alert.alert("Logout?", "You will return to the public landing page.", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogout },
    ]);
  }

  function goToProfile() {
    if (user?.role === "driver") {
      router.push("/(driver)/profile");
      return;
    }

    if (user?.role === "passenger") {
      router.push("/(passenger)/profile");
      return;
    }

    router.push("/(public)/landing");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title="Settings" subtitle="Account controls" showBackButton />

      <View style={styles.logoutCard}>
        <Text style={styles.sectionTitle}>Session</Text>
        <Text style={styles.logoutText}>
          Sign out from this device and return to the public landing page.
        </Text>
        <CustomButton
          title="Logout from Account"
          variant="danger"
          onPress={confirmLogout}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>

        <CustomButton title="Edit Profile" onPress={goToProfile} />
        <View style={styles.spacer} />
        <CustomButton
          title="Change Password"
          onPress={() => router.push("/change-password")}
        />
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
    paddingBottom: 36,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  logoutCard: {
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
  },

  spacer: {
    height: 12,
  },

  logoutText: {
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
});
