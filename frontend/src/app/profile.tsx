import { ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../theme/colors";
import { DriverUser, PassengerUser } from "../types/auth";

export default function ProfileScreen() {
  const { user } = useAuth();

  const fullName =
    user?.role === "passenger" || user?.role === "driver"
      ? (user as PassengerUser | DriverUser).fullName
      : undefined;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title="Profile" subtitle="Account details" showBackButton />

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{fullName?.slice(0, 1) ?? "L"}</Text>
        </View>

        <Text style={styles.name}>{fullName ?? "LatitudeLord User"}</Text>
        <Text style={styles.email}>{user?.email ?? "Not signed in"}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role ?? "guest"}</Text>
        </View>
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
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: Colors.primary,
    fontWeight: "900",
    fontSize: 30,
  },

  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  email: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  infoRow: {
    width: "100%",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  label: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },

  value: {
    marginTop: 6,
    color: Colors.primary,
    fontWeight: "800",
    textTransform: "capitalize",
  },
});
