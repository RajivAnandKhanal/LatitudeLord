import { ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function ContactScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <PageHeader
        title="Contact Us"
        subtitle="LatitudeLord Support"
        showBackButton
      />

      <View style={styles.card}>
        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          support@latitudelord.com
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Phone
        </Text>

        <Text style={styles.value}>
          +977-9800000000
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Office
        </Text>

        <Text style={styles.value}>
          Kathmandu, Nepal
        </Text>
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
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  label: {
    fontWeight: "800",
    marginBottom: 6,
  },

  value: {
    color: Colors.textSecondary,
  },
});