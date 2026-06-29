import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import FormSelect from "../../components/common/FormSelect";
import FormStatus from "../../components/common/FormStatus";
import PageHeader from "../../components/common/PageHeader";
import ProgressSteps from "../../components/common/ProgressSteps";
import ImagePickerField from "../../components/forms/ImagePickerField";

import { mockUsers } from "../../mock/users";
import { Colors } from "../../theme/colors";
import {
  getPasswordHelp,
  validateEmail,
  validateName,
  validatePassword,
  validateRequired,
} from "../../utils/validation";

type Status = { type: "success" | "error"; title: string; message: string };

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export default function RegisterPassengerScreen() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function goStepOne() {
    const nextErrors: Record<string, string> = {};

    if (!validateName(fullName)) nextErrors.fullName = "Enter your full name.";

    if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    } else if (
      mockUsers.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    ) {
      nextErrors.email = "An account with this email already exists.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check personal information",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setStatus(null);
    setStep(2);
  }

  function goStepTwo() {
    const nextErrors: Record<string, string> = {};

    if (!validateRequired(photoUrl))
      nextErrors.photoUrl = "Profile photo is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Photo required",
        message: "Please upload a profile photo before continuing.",
      });
      return;
    }

    setStatus(null);
    setStep(3);
  }

  async function submitForm() {
    const nextErrors: Record<string, string> = {};

    if (!validatePassword(password)) nextErrors.password = getPasswordHelp();
    if (password !== confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check security details",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      mockUsers.push({
        id: `p-${Date.now()}`,
        role: "passenger",
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        gender,
        healthCondition,
        photoUrl,
      });

      setStatus({
        type: "success",
        title: "Account created",
        message: "Passenger account created successfully.",
      });

      setTimeout(() => router.replace("/(auth)/login"), 800);
    } catch {
      setStatus({
        type: "error",
        title: "Something went wrong",
        message: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen>
      <PageHeader title="Passenger Registration" showBackButton />
      <ProgressSteps total={3} current={step} />

      {status && (
        <FormStatus
          type={status.type}
          title={status.title}
          message={status.message}
        />
      )}

      {step === 1 && (
        <View>
          <Text style={styles.heading}>Personal Information</Text>

          <CustomInput
            label="Full Name *"
            placeholder="Enter full name"
            value={fullName}
            textContentType="name"
            error={errors.fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            label="Email Address *"
            placeholder="name@example.com"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            error={errors.email}
            onChangeText={setEmail}
          />

          <FormSelect
            label="Gender (optional)"
            value={gender}
            placeholder="Select gender"
            options={genderOptions}
            error={errors.gender}
            onChange={setGender}
          />

          <CustomButton title="Continue" onPress={goStepOne} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.heading}>Additional Information</Text>

          <CustomInput
            label="Health Condition (optional)"
            placeholder="e.g., physical disability, seat reservation needed"
            value={healthCondition}
            error={errors.healthCondition}
            onChangeText={setHealthCondition}
          />

          <ImagePickerField label="Profile Photo *" onImageSelected={setPhotoUrl} />
          {!!errors.photoUrl && <Text style={styles.error}>{errors.photoUrl}</Text>}

          <View style={styles.row}>
            <View style={styles.half}>
              <CustomButton
                title="Back"
                disabled={loading}
                onPress={() => setStep(1)}
              />
            </View>
            <View style={styles.half}>
              <CustomButton title="Continue" onPress={goStepTwo} />
            </View>
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.heading}>Security</Text>

          <CustomInput
            label="Password *"
            placeholder="Create password"
            secureTextEntry
            value={password}
            textContentType="newPassword"
            error={errors.password}
            onChangeText={setPassword}
          />

          <CustomInput
            label="Confirm Password *"
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            textContentType="newPassword"
            returnKeyType="done"
            error={errors.confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <CustomButton
                title="Back"
                disabled={loading}
                onPress={() => setStep(2)}
              />
            </View>
            <View style={styles.half}>
              <CustomButton
                title="Create Account"
                loading={loading}
                disabled={loading}
                onPress={submitForm}
              />
            </View>
          </View>
        </View>
      )}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 18,
  },
  row: { flexDirection: "row", gap: 12, marginTop: 6 },
  half: { flex: 1 },
  error: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
});
