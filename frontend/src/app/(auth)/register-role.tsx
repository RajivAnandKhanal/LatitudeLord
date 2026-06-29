import { StyleSheet, Text } from "react-native";

import { router } from "expo-router";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";
import RoleCard from "../../components/common/RoleCard";

import { Colors } from "../../theme/colors";

export default function RegisterRoleScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Create Account" showBackButton />

      <Text style={styles.title}>Choose Account Type</Text>

      <Text style={styles.subtitle}>
        Select how you want to use LatitudeLord.
      </Text>

      <RoleCard
        title="Passenger"
        description="Track nearby buses, view ETA, chat and get support."
        icon="person"
        onPress={() => router.push("/(auth)/register-passenger")}
      />

      <RoleCard
        title="Driver / Bus Operator"
        description="Register your bus, route and staff details."
        icon="bus"
        onPress={() => router.push("/(auth)/register-driver")}
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
