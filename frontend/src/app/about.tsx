import { StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/common/PageHeader";

import { Colors } from "../theme/colors";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <PageHeader title="About Developers" showBackButton />

      <View style={styles.card}>
        <Text style={styles.title}>LatitudeLord</Text>

        <Text style={styles.text}>
          Smart Bus Tracking Platform designed for Nepal.
        </Text>

        <Text style={styles.text}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
  },

  text: {
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});
