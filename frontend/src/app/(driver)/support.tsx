import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

const EMERGENCY_NUMBERS = [
  { label: "Nepal Police", number: "100" },
  { label: "Traffic Police", number: "103" },
  { label: "National Women Commission Helpline", number: "1145" },
  { label: "Child Helpline", number: "1098" },
];

export default function SupportScreen() {
  const [message, setMessage] = useState("");

  function callNumber(number: string) {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert("Unable to place call", `Please dial ${number} manually.`),
    );
  }

  function submitTicket() {
    Alert.alert("Ticket Submitted", "Our support team will contact you soon.");
    setMessage("");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Support"
          subtitle="We're here to help"
          showBackButton
        />

        <View style={styles.card}>
          <Ionicons name="call-outline" size={26} color={Colors.primary} />
          <Text style={styles.heading}>24/7 Driver Support</Text>
          <Text style={styles.text}>Phone: +977-9800000000</Text>
          <Text style={styles.text}>Email: support@latitudelord.com</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Emergency Helplines</Text>
          {EMERGENCY_NUMBERS.map((item) => (
            <TouchableOpacity
              key={item.number}
              style={styles.helplineRow}
              onPress={() => callNumber(item.number)}
            >
              <Ionicons name="call" size={20} color="#EF4444" />
              <View style={styles.helplineBody}>
                <Text style={styles.helplineLabel}>{item.label}</Text>
                <Text style={styles.text}>Tap to call {item.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Describe your issue</Text>

        <TextInput
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
          placeholder="Write here..."
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, !message.trim() && styles.buttonDisabled]}
          disabled={!message.trim()}
          onPress={submitTicket}
        >
          <Text style={styles.buttonText}>Submit Ticket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    color: Colors.text,
  },
  text: {
    marginTop: 6,
    color: Colors.textSecondary,
  },
  helplineRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  helplineBody: {
    marginLeft: 12,
    flex: 1,
    alignItems: "flex-start",
  },
  helplineLabel: {
    fontWeight: "700",
    color: Colors.text,
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    height: 160,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
