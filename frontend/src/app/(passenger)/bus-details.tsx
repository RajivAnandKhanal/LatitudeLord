<PageHeader title="Bus Details" />;
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "@/src/components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function BusDetailsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Ba 3 Kha 2245</Text>

        <Text style={styles.route}>Kalanki → Koteshwor</Text>

        <View style={styles.card}>
          <Text style={styles.label}>GPS ETA</Text>

          <Text style={styles.value}>4 Minutes</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>ML ETA</Text>

          <Text style={styles.value}>5 Minutes</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Driver</Text>

          <Text style={styles.value}>Ram Sharma</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Bus Staff</Text>

          <Text style={styles.value}>Sita Thapa</Text>
        </View>

        <TouchableOpacity style={styles.primary}>
          <Text style={styles.primaryText}>Track Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary}>
          <Text style={styles.secondaryText}>Chat With Staff</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
  },

  route: {
    color: Colors.textSecondary,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },

  label: {
    color: Colors.textSecondary,
  },

  value: {
    fontWeight: "700",
    fontSize: 18,
    marginTop: 4,
  },

  primary: {
    height: 58,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  secondary: {
    height: 58,
    backgroundColor: "#E2E8F0",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  secondaryText: {
    fontWeight: "700",
  },
});
