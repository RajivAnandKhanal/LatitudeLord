
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";

export default function SupportScreen() {
  return (
    <AuthScreen>
      <PageHeader title="Support" />

      <View style={styles.card}>
        <Text>
          Support will use Driver and Bus Staff information supplied during
          registration.
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
