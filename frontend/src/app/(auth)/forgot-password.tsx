import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import FormStatus from "../../components/common/FormStatus";
import PageHeader from "../../components/common/PageHeader";

import * as authService from "../../services/authService";
import { Colors } from "../../theme/colors";
import { validateEmail } from "../../utils/validation";

type Status = { type: "success" | "error"; title: string; message: string };

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit() {
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(undefined);
    setLoading(true);
    setStatus(null);

    try {
      // Always succeeds the same way whether or not the email is
      // registered — the backend never reveals that, so don't imply it
      // here either.
      await authService.forgotPassword(email.trim());

      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: email.trim() },
      });
    } catch (err) {
      setStatus({
        type: "error",
        title: "Something went wrong",
        message:
          err instanceof Error ? err.message : "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen>
      <PageHeader title="Forgot Password" showBackButton />

      <View style={styles.card}>
        <Text style={styles.heading}>Reset your password</Text>
        <Text style={styles.subheading}>
          Enter the email on your account and we'll send you a 6-digit code to
          reset your password.
        </Text>

        {status && (
          <FormStatus
            type={status.type}
            title={status.title}
            message={status.message}
          />
        )}

        <CustomInput
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          error={error}
          onChangeText={setEmail}
        />

        <CustomButton
          title="Send Reset Code"
          loading={loading}
          disabled={loading}
          onPress={handleSubmit}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  subheading: {
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
});
