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

import { useAuth } from "../../hooks/useAuth";
import * as busService from "../../services/busService";
import * as staffService from "../../services/staffService";
import * as routeService from "../../services/routeService";
import { toBackendDay } from "../../adapters/busAdapters";
import { DEFAULT_LOCATION } from "../../services/locationService";
import { Colors } from "../../theme/colors";
import { DayOfWeek } from "../../types/auth";
import {
  getPasswordHelp,
  validateEmail,
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
  const {
    register: registerAccount,
    updateUser,
    refreshDriverBuses,
  } = useAuth();
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

    if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
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
      // 1. Create the driver's own login.
      await registerAccount({
        name: driverName.trim(),
        email: email.trim(),
        password,
        role: "driver",
        phone: driverPhone || undefined,
      });

      // 1b. Upload & save the driver photo captured in step 3. This has to
      // happen after registerAccount (uploading needs an authenticated
      // session) — it uploads the local picker URI and persists the
      // returned permanent URL as the driver's avatar, same as editing the
      // photo from the profile screen does.
      if (photoUrl) {
        await updateUser({ photoUrl });
      }

      // 2. Register the bus under that driver.
      const bus = await busService.createBus({
        busNumber: (busNumber || busPlate).trim(),
        plateNumber: busPlate.trim(),
      });

      // 3. Create the staff/conductor record for this bus (no login of their own).
      await staffService.createStaff({
        name: staffName.trim() || "Bus Staff",
        phone: staffPhone,
      });

      // 4. Save the weekly schedule. The form only collects a free-text
      // route per day (e.g. "Ratnapark to Jorpati") rather than picking
      // stops on a map, so we store it as a two-stop route using the
      // app's default coordinates as placeholders — good enough to show
      // the schedule, but real stop locations should be set from the
      // driver's route-editing screen for live tracking to be accurate.
      const schedule = days
        .filter((day) => routes[day].trim().toLowerCase() !== "off")
        .map((day) => {
          const [from, to] = routes[day].split(/ to |→/i).map((s) => s.trim());
          return {
            day: toBackendDay(day),
            stations: [
              { name: from || routes[day].trim(), ...DEFAULT_LOCATION },
              {
                name: to || "Destination",
                latitude: DEFAULT_LOCATION.latitude + 0.01,
                longitude: DEFAULT_LOCATION.longitude + 0.01,
              },
            ].map((s) => ({ name: s.name, lat: s.latitude, lng: s.longitude })),
          };
        });

      if (schedule.length > 0) {
        await routeService.setSchedule(bus._id, schedule);
      }

      // 5. The bus, staff, and schedule created in steps 2–4 all happened
      // after the driver's cached profile (built right after step 1) was
      // already set — so it still thinks this driver has no buses. Refresh
      // it now so the profile/dashboard show the bus, staff, and trip
      // details that were just entered instead of an empty state.
      await refreshDriverBuses();

      setStatus({
        type: "success",
        title: "Account created",
        message: "Driver account created successfully.",
      });

      setTimeout(() => router.replace("/(driver)/dashboard"), 800);
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
            label="Bus Staff Phone Number"
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

          <ImagePickerField
            label="Driver Photo *"
            onImageSelected={setPhotoUrl}
          />
          {!!errors.photoUrl && (
            <Text style={styles.error}>{errors.photoUrl}</Text>
          )}

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
