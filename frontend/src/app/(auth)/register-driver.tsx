import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import FormStatus from "../../components/common/FormStatus";
import PageHeader from "../../components/common/PageHeader";
import ProgressSteps from "../../components/common/ProgressSteps";
import ImagePickerField from "../../components/forms/ImagePickerField";

import { mockUsers } from "../../mock/users";
import { Colors } from "../../theme/colors";
import { DayOfWeek } from "../../types/auth";
import {
  getPasswordHelp,
  validateName,
  validatePassword,
  validatePhone,
  validatePlateNumber,
  validateRequired,
} from "../../utils/validation";

type Status = { type: "success" | "error"; title: string; message: string };

const days: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function RegisterDriverScreen() {
  const [step, setStep] = useState(1);

  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [busPlate, setBusPlate] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [routes, setRoutes] = useState<Record<DayOfWeek, string>>({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setRoute(day: DayOfWeek, value: string) {
    setRoutes((prev) => ({ ...prev, [day]: value }));
  }

  function goStepOne() {
    const nextErrors: Record<string, string> = {};

    if (!validateName(driverName)) {
      nextErrors.driverName = "Enter driver full name.";
    }

    if (driverPhone && !validatePhone(driverPhone)) {
      nextErrors.driverPhone = "Enter a valid Nepal mobile number.";
    }

    if (!validatePlateNumber(busPlate)) {
      nextErrors.busPlate = "Enter a valid bus number plate.";
    } else if (
      mockUsers.some(
        (item) =>
          item.role === "driver" &&
          item.buses.some(
            (bus) =>
              bus.numberPlate.toLowerCase() === busPlate.trim().toLowerCase(),
          ),
      )
    ) {
      nextErrors.busPlate = "This bus plate is already registered.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check driver & bus details",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setStatus(null);
    setStep(2);
  }

  function goStepTwo() {
    const nextErrors: Record<string, string> = {};

    if (!validatePhone(staffPhone)) {
      nextErrors.staffPhone = "Enter a valid Nepal mobile number.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check bus staff details",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setStatus(null);
    setStep(3);
  }

  function goStepThree() {
    const nextErrors: Record<string, string> = {};

    days.forEach((day) => {
      if (!validateRequired(routes[day])) {
        nextErrors[day] = "Required.";
      }
    });

    if (!validateRequired(photoUrl)) {
      nextErrors.photoUrl = "Driver photo is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check route & photo details",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    setStatus(null);
    setStep(4);
  }

  async function submitForm() {
    const nextErrors: Record<string, string> = {};

    if (!validateRequired(email)) {
      nextErrors.email = "Enter an email address.";
    } else if (
      mockUsers.some(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      nextErrors.email = "An account with this email already exists.";
    }

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

      const busId = `bus-${Date.now()}`;

      mockUsers.push({
        id: `d-${Date.now()}`,
        role: "driver",
        email: email.trim(),
        password,
        fullName: driverName.trim(),
        phoneNumber: driverPhone || undefined,
        photoUrl,
        buses: [
          {
            id: busId,
            numberPlate: busPlate.trim(),
            companyBusNumber: busNumber || undefined,
            staff: [
              {
                id: `staff-${Date.now()}`,
                staffName: staffName.trim() || "Bus Staff",
                staffPhone,
              },
            ],
            schedule: days
              .filter((day) => routes[day].trim().toLowerCase() !== "off")
              .map((day) => ({
                dayOfWeek: day,
                departureTime: "07:00",
                routeName: routes[day].trim(),
              })),
          },
        ],
      });

      setStatus({
        type: "success",
        title: "Account created",
        message: "Driver account created successfully.",
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
      <PageHeader title="Driver Registration" showBackButton />
      <ProgressSteps total={4} current={step} />

      {status && (
        <FormStatus
          type={status.type}
          title={status.title}
          message={status.message}
        />
      )}

      {step === 1 && (
        <View>
          <Text style={styles.heading}>Driver & Bus Details</Text>

          <CustomInput
            label="Driver Name *"
            placeholder="Enter full name"
            value={driverName}
            textContentType="name"
            error={errors.driverName}
            onChangeText={setDriverName}
          />

          <CustomInput
            label="Driver Phone Number (optional)"
            placeholder="98XXXXXXXX"
            value={driverPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            error={errors.driverPhone}
            onChangeText={setDriverPhone}
          />

          <CustomInput
            label="Bus Number Plate *"
            placeholder="e.g., BA 3 KHA 1234"
            value={busPlate}
            autoCapitalize="characters"
            error={errors.busPlate}
            onChangeText={setBusPlate}
          />

          <CustomInput
            label="Bus Number (optional, if company has multiple)"
            placeholder="e.g., Bus #4"
            value={busNumber}
            error={errors.busNumber}
            onChangeText={setBusNumber}
          />

          <CustomButton title="Continue" onPress={goStepOne} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.heading}>Bus Staff Details</Text>

          <CustomInput
            label="Bus Staff Name (optional)"
            placeholder="Staff member name"
            value={staffName}
            error={errors.staffName}
            onChangeText={setStaffName}
          />

          <CustomInput
            label="Bus Staff Phone Number *"
            placeholder="98XXXXXXXX"
            value={staffPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            error={errors.staffPhone}
            onChangeText={setStaffPhone}
          />

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
          <Text style={styles.heading}>Weekly Routes & Photo</Text>

          <ImagePickerField label="Driver Photo *" onImageSelected={setPhotoUrl} />
          {!!errors.photoUrl && <Text style={styles.error}>{errors.photoUrl}</Text>}

          <Text style={styles.subHeading}>Weekly Routes *</Text>

          {days.map((day) => (
            <CustomInput
              key={day}
              label={`${day.charAt(0).toUpperCase()}${day.slice(1)} Route *`}
              placeholder="e.g., Ratnapark to Jorpati, or Off"
              value={routes[day]}
              error={errors[day]}
              onChangeText={(value) => setRoute(day, value)}
            />
          ))}

          <View style={styles.row}>
            <View style={styles.half}>
              <CustomButton
                title="Back"
                disabled={loading}
                onPress={() => setStep(2)}
              />
            </View>
            <View style={styles.half}>
              <CustomButton title="Continue" onPress={goStepThree} />
            </View>
          </View>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text style={styles.heading}>Account & Security</Text>

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
                onPress={() => setStep(3)}
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
  subHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 10,
    marginBottom: 12,
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
