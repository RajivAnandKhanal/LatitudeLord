import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import FormStatus from "../../components/common/FormStatus";
import PageHeader from "../../components/common/PageHeader";

import * as authService from "../../services/authService";
import { Colors } from "../../theme/colors";
import { getPasswordHelp, validatePassword } from "../../utils/validation";

type Status = { type: "success" | "error"; title: string; message: string };

export default function ResetPasswordScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(emailParam ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit() {
    const nextErrors: Record<string, string> = {};

    if (!/^\d{6}$/.test(code.trim())) {
      nextErrors.code = "Enter the 6-digit code from your email.";
    }
    if (!validatePassword(password)) {
      nextErrors.password = getPasswordHelp();
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check the highlighted fields",
        message: "Please fix the errors below.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await authService.resetPassword(email.trim(), code.trim(), password);

      setStatus({
        type: "success",
        title: "Password reset",
        message: "You can now log in with your new password.",
      });

      setTimeout(() => router.replace("/(auth)/login"), 900);
    } catch (err) {
      setStatus({
        type: "error",
        title: "Reset failed",
        message:
          err instanceof Error
            ? err.message
            : "That code may be wrong or expired — request a new one.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen>
      <PageHeader title="Reset Password" showBackButton />

      <View style={styles.card}>
        <Text style={styles.heading}>Enter your code</Text>
        <Text style={styles.subheading}>
          We sent a 6-digit code to {email || "your email"}. Enter it below with
          your new password.
        </Text>

        {status && (
          <FormStatus
            type={status.type}
            title={status.title}
            message={status.message}
          />
        )}

        {!emailParam && (
          <CustomInput
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            onChangeText={setEmail}
          />
        )}

        <CustomInput
          label="6-Digit Code"
          placeholder="123456"
          value={code}
          keyboardType="number-pad"
          error={errors.code}
          onChangeText={setCode}
        />

        <CustomInput
          label="New Password"
          placeholder="Create new password"
          secureTextEntry
          value={password}
          textContentType="newPassword"
          error={errors.password}
          onChangeText={setPassword}
        />

        <CustomInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          textContentType="newPassword"
          returnKeyType="done"
          error={errors.confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <CustomButton
          title="Reset Password"
          loading={loading}
          disabled={loading}
          onPress={handleSubmit}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text style={styles.link}>Didn't get a code? Send again</Text>
        </TouchableOpacity>
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
  link: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.primary,
    fontWeight: "600",
  },
});
