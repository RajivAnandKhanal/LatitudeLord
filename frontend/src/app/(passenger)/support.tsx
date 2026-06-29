import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function SupportScreen() {
  function handlePress(title: string) {
    Alert.alert("Support", `${title} feature will connect with backend.`);
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

      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress("Call Support")}
      >
        <Ionicons name="call-outline" size={26} color={Colors.primary} />
        <View style={styles.cardBody}>
          <Text style={styles.title}>Call Support</Text>
          <Text style={styles.subtitle}>
            Speak directly with customer support.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress("Email Support")}
      >
        <Ionicons name="mail-outline" size={26} color={Colors.primary} />
        <View style={styles.cardBody}>
          <Text style={styles.title}>Email Support</Text>
          <Text style={styles.subtitle}>
            support@latitudelord.com
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress("Emergency Contact")}
      >
        <Ionicons name="warning-outline" size={26} color="#EF4444" />
        <View style={styles.cardBody}>
          <Text style={styles.title}>Emergency Contact</Text>
          <Text style={styles.subtitle}>
            Report accidents or emergencies.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress("Live Chat")}
      >
        <Ionicons name="chatbubbles-outline" size={26} color={Colors.primary} />
        <View style={styles.cardBody}>
          <Text style={styles.title}>Live Chat</Text>
          <Text style={styles.subtitle}>
            Chat with support agents.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.faqCard}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

        <Text style={styles.question}>
          • How do I track my bus?
        </Text>

        <Text style={styles.answer}>
          Open the Map tab and select your bus.
        </Text>

        <Text style={styles.question}>
          • How do I contact the driver?
        </Text>

        <Text style={styles.answer}>
          Open Chat and select Driver.
        </Text>

        <Text style={styles.question}>
          • How do I report a problem?
        </Text>

        <Text style={styles.answer}>
          Use the Feedback section.
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
    paddingBottom: 40,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
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