import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import CustomButton from "../components/common/CustomButton";
import CustomInput from "../components/common/CustomInput";
import FormStatus from "../components/common/FormStatus";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../theme/colors";
import { getPasswordHelp, validatePassword, validateRequired } from "../utils/validation";

type Status = { type: "success" | "error"; title: string; message: string };

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSave() {
    const nextErrors: Record<string, string> = {};

    if (!validateRequired(currentPassword)) {
      nextErrors.currentPassword = "Enter your current password.";
    }

    if (!validatePassword(newPassword)) {
      nextErrors.newPassword = getPasswordHelp();
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (!result.success) {
        setStatus({
          type: "error",
          title: "Couldn't change password",
          message: result.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setStatus({
        type: "success",
        title: "Password updated",
        message: "Your password has been changed successfully.",
      });

      setTimeout(() => router.back(), 900);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader
        title="Change Password"
        subtitle="Keep your account secure"
        showBackButton
      />

      {status && (
        <FormStatus
          type={status.type}
          title={status.title}
          message={status.message}
        />
      )}

      <CustomInput
        label="Current Password"
        placeholder="Enter current password"
        secureTextEntry
        value={currentPassword}
        textContentType="password"
        error={errors.currentPassword}
        onChangeText={setCurrentPassword}
      />

      <CustomInput
        label="New Password"
        placeholder="Create new password"
        secureTextEntry
        value={newPassword}
        textContentType="newPassword"
        error={errors.newPassword}
        onChangeText={setNewPassword}
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

      <View style={styles.buttonWrap}>
        <CustomButton
          title="Update Password"
          loading={saving}
          disabled={saving}
          onPress={handleSave}
        />
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

  buttonWrap: {
    marginTop: 6,
  },
});
