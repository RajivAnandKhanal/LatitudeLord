import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import CustomButton from "../components/common/CustomButton";
import CustomInput from "../components/common/CustomInput";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../theme/colors";

export default function FeedbackScreen() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState("");

  function handleSubmit() {
    const payload = {
      message: feedback,
      anonymous: true,
      sourceRole: user?.role ?? "guest",
    };

    Alert.alert("Ready For Backend", JSON.stringify(payload, null, 2));
    setFeedback("");
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

        <CustomButton title="Submit Feedback" onPress={handleSubmit} />
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
