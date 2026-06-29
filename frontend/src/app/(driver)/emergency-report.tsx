import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function EmergencyReportScreen() {
  const [message, setMessage] = useState("");

  function sendReport() {
    Alert.alert("Emergency Reported", "Control room has been notified.", [
      {
        text: "OK",
        onPress: () => {
          setMessage("");
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader title="Emergency" subtitle="Driver Safety" showBackButton />

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Emergency Reporting</Text>

          <Text style={styles.warningText}>
            Use only for accidents, vehicle breakdown, medical emergencies or
            security incidents.
          </Text>
        </View>

        <Text style={styles.label}>Describe the situation</Text>

        <TextInput
          multiline
          numberOfLines={8}
          value={message}
          onChangeText={setMessage}
          placeholder="Explain what happened..."
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, !message.trim() && styles.buttonDisabled]}
          disabled={!message.trim()}
          onPress={sendReport}
        >
          <Text style={styles.buttonText}>Send Emergency Alert</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  warning: {
    backgroundColor: "#FEE2E2",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#B91C1C",
  },
  warningText: {
    marginTop: 10,
    lineHeight: 22,
  },
  label: {
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 24,
    height: 56,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },
});
