import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";

import { Colors } from "../../theme/colors";

export default function ProfileScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Profile" />

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>

        <Text style={styles.value}>Passenger Name</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>

        <Text style={styles.value}>user@email.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Gender</Text>

        <Text style={styles.value}>Female</Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },

  label: {
    color: Colors.textSecondary,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
});
