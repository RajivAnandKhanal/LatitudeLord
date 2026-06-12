
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";

export default function FeedbackScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Feedback" />

      <View style={styles.card}>
        <Text>All feedback is anonymous.</Text>

        <Text style={{ marginTop: 10 }}>
          Messages containing banned words will automatically be rejected.
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
  },
});
