import { ScrollView, StyleSheet, Text } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function PrivacyScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <PageHeader
        title="Privacy Policy"
        subtitle="How we use data"
        showBackButton
      />

      <Text style={styles.text}>
        LatitudeLord collects location data
        only when users enable location
        tracking.
      </Text>

      <Text style={styles.text}>
        Personal information is stored
        securely and is never shared with
        unauthorized third parties.
      </Text>

      <Text style={styles.text}>
        Driver and bus location information
        is used solely for live bus tracking
        and ETA calculations.
      </Text>

      <Text style={styles.text}>
        Future backend implementations will
        follow applicable privacy and data
        protection regulations.
      </Text>
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

  text: {
    marginBottom: 16,
    color: Colors.text,
    lineHeight: 24,
  },
});