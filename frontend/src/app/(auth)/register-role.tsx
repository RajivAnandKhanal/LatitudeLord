import { StyleSheet, Text } from "react-native";

import { router } from "expo-router";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";
import RoleCard from "../../components/common/RoleCard";

import { Colors } from "../../theme/colors";

export default function RegisterRoleScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Create Account" />

      <Text style={styles.title}>Choose Your Role</Text>

      <Text style={styles.subtitle}>
        Select the account type that best describes how you'll use LatitudeLord.
      </Text>

      <RoleCard
        title="Passenger"
        description="Track buses, estimate arrivals and chat with staff."
        icon="person"
        onPress={() => router.push("/register-passenger")}
      />

      <RoleCard
        title="Bus Owner"
        description="Manage buses, drivers and staff information."
        icon="bus"
        onPress={() => router.push("/register-owner")}
      />

      <RoleCard
        title="Bus Staff"
        description="Assist passengers and communicate during journeys."
        icon="people"
        onPress={() => router.push("/register-staff")}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },

  subtitle: {
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 28,
  },
});
