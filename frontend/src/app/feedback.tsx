import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import CustomButton from "../components/common/CustomButton";
import CustomInput from "../components/common/CustomInput";
import PageHeader from "../components/common/PageHeader";
import * as feedbackService from "../services/feedbackService";
import { Colors } from "../theme/colors";

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      await feedbackService.submitFeedback(feedback.trim());
      Alert.alert("Thank you!", "Your feedback was submitted anonymously.");
      setFeedback("");
    } catch (err) {
      Alert.alert(
        "Couldn't submit feedback",
        err instanceof Error ? err.message : "Please try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title="Bug Report / Feedback" subtitle="Anonymous message" showBackButton />

      <View style={styles.card}>
        <Text style={styles.notice}>
          Messages are sent anonymously. Messages containing offensive Nepali or
          English words are automatically rejected.
        </Text>

        <CustomInput
          label="Message"
          placeholder="Write your bug report or feedback"
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />

        <CustomButton title="Submit Feedback" loading={submitting} disabled={submitting} onPress={handleSubmit} />
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
    paddingBottom: 36,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  notice: {
    marginBottom: 18,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: "600",
  },
});
