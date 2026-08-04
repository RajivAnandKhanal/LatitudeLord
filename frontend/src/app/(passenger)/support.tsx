import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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
  function callNumber(number: string) {
    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert("Unable to place call", `Please dial ${number} manually.`),
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="Support Center"
        subtitle="Need help? Contact us anytime"
        showBackButton
      />

      <View style={styles.faqCard}>
        <Text style={styles.faqTitle}>Emergency Helplines</Text>
        {EMERGENCY_NUMBERS.map((item) => (
          <TouchableOpacity
            key={item.number}
            style={styles.helplineRow}
            onPress={() => callNumber(item.number)}
          >
            <View style={styles.helplineIcon}>
              <Ionicons name="call" size={20} color="#EF4444" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.title}>{item.label}</Text>
              <Text style={styles.subtitle}>Tap to call {item.number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.faqCard}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

        <Text style={styles.question}>• How do I track my bus?</Text>

        <Text style={styles.answer}>Open the Map tab and select your bus.</Text>

        <Text style={styles.question}>• How do I contact the driver?</Text>

        <Text style={styles.answer}>Open Chat and select Driver.</Text>

        <Text style={styles.question}>• How do I report a problem?</Text>

        <Text style={styles.answer}>Use the Feedback section.</Text>
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
    paddingBottom: 40,
  },

  cardBody: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  faqTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: Colors.text,
  },

  helplineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  helplineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  question: {
    fontWeight: "700",
    marginTop: 10,
    color: Colors.text,
  },

  answer: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
