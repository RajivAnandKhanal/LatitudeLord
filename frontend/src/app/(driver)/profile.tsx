import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import ImagePickerField from "../../components/forms/ImagePickerField";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../theme/colors";
import { DayOfWeek, DriverUser } from "../../types/auth";
import {
  validateName,
  validatePhone,
  validatePlateNumber,
  validateRequired,
} from "../../utils/validation";

const dayLabels: { key: DayOfWeek; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function DriverProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const bus = driver?.buses?.[0];

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fullName, setFullName] = useState(driver?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(driver?.phoneNumber ?? "");
  const [photoUrl, setPhotoUrl] = useState(driver?.photoUrl ?? "");

  const [numberPlate, setNumberPlate] = useState(bus?.numberPlate ?? "");
  const [companyBusNumber, setCompanyBusNumber] = useState(
    bus?.companyBusNumber ?? "",
  );
  const [staffName, setStaffName] = useState(bus?.staff?.[0]?.staffName ?? "");
  const [staffPhone, setStaffPhone] = useState(
    bus?.staff?.[0]?.staffPhone ?? "",
  );

  const scheduleByDay: Record<DayOfWeek, string> = {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  };

  bus?.schedule?.forEach((entry) => {
    scheduleByDay[entry.dayOfWeek] = entry.routeName;
  });

  const [routes, setRoutes] = useState<Record<DayOfWeek, string>>(scheduleByDay);

  function setRoute(day: DayOfWeek, value: string) {
    setRoutes((prev) => ({ ...prev, [day]: value }));
  }

  function startEditing() {
    setFullName(driver?.fullName ?? "");
    setPhoneNumber(driver?.phoneNumber ?? "");
    setPhotoUrl(driver?.photoUrl ?? "");
    setNumberPlate(bus?.numberPlate ?? "");
    setCompanyBusNumber(bus?.companyBusNumber ?? "");
    setStaffName(bus?.staff?.[0]?.staffName ?? "");
    setStaffPhone(bus?.staff?.[0]?.staffPhone ?? "");
    setRoutes({ ...scheduleByDay });
    setErrors({});
    setEditing(true);
  }

  async function saveChanges() {
    if (!driver || !bus) return;

    const nextErrors: Record<string, string> = {};

    if (!validateName(fullName)) nextErrors.fullName = "Enter your full name.";
    if (phoneNumber && !validatePhone(phoneNumber)) {
      nextErrors.phoneNumber = "Enter a valid Nepal mobile number.";
    }
    if (!validatePlateNumber(numberPlate)) {
      nextErrors.numberPlate = "Enter a valid bus number plate.";
    }
    if (!validateRequired(staffName)) {
      nextErrors.staffName = "Enter the bus staff name.";
    }
    if (!validatePhone(staffPhone)) {
      nextErrors.staffPhone = "Enter a valid Nepal mobile number.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      const updatedBus = {
        ...bus,
        numberPlate: numberPlate.trim(),
        companyBusNumber: companyBusNumber || undefined,
        staff: [
          {
            id: bus.staff[0]?.id ?? `staff-${Date.now()}`,
            staffName: staffName.trim(),
            staffPhone,
          },
        ],
        schedule: dayLabels
          .filter(({ key }) => routes[key].trim().toLowerCase() !== "off" && routes[key].trim() !== "")
          .map(({ key }) => ({
            dayOfWeek: key,
            departureTime:
              bus.schedule.find((entry) => entry.dayOfWeek === key)
                ?.departureTime ?? "07:00",
            routeName: routes[key].trim(),
          })),
      };

      await updateUser({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber || undefined,
        photoUrl,
        buses: [updatedBus, ...driver.buses.slice(1)],
      });

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function confirmLogout() {
    Alert.alert("Logout?", "You will be signed out of your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)/landing");
        },
      },
    ]);
  }

  if (editing) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Edit Profile" subtitle="Update your details" showBackButton />

        <Text style={styles.sectionTitle}>Personal Information</Text>

        <ImagePickerField label="Driver Photo" onImageSelected={setPhotoUrl} />

        <CustomInput
          label="Email Address"
          value={driver?.email}
          editable={false}
        />

        <CustomInput
          label="Full Name"
          value={fullName}
          error={errors.fullName}
          onChangeText={setFullName}
        />

        <CustomInput
          label="Phone Number"
          placeholder="98XXXXXXXX"
          value={phoneNumber}
          keyboardType="phone-pad"
          error={errors.phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.sectionTitle}>Bus Details</Text>

        <CustomInput
          label="Bus Number Plate"
          value={numberPlate}
          autoCapitalize="characters"
          error={errors.numberPlate}
          onChangeText={setNumberPlate}
        />

        <CustomInput
          label="Bus Number (optional)"
          value={companyBusNumber}
          onChangeText={setCompanyBusNumber}
        />

        <Text style={styles.sectionTitle}>Bus Staff</Text>

        <CustomInput
          label="Staff Name"
          value={staffName}
          error={errors.staffName}
          onChangeText={setStaffName}
        />

        <CustomInput
          label="Staff Phone Number"
          placeholder="98XXXXXXXX"
          value={staffPhone}
          keyboardType="phone-pad"
          error={errors.staffPhone}
          onChangeText={setStaffPhone}
        />

        <Text style={styles.sectionTitle}>Weekly Routes</Text>

        {dayLabels.map(({ key, label }) => (
          <CustomInput
            key={key}
            label={label}
            placeholder="e.g., Kalanki to Koteshwor, or Off"
            value={routes[key]}
            onChangeText={(value) => setRoute(key, value)}
          />
        ))}

        <View style={styles.buttonRow}>
          <View style={styles.half}>
            <CustomButton
              title="Cancel"
              disabled={saving}
              onPress={() => setEditing(false)}
            />
          </View>
          <View style={styles.half}>
            <CustomButton
              title="Save Changes"
              loading={saving}
              disabled={saving}
              onPress={saveChanges}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title="Profile" subtitle="Your registration details" />

      <View style={styles.profileCard}>
        {driver?.photoUrl ? (
          <Image source={{ uri: driver.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {driver?.fullName?.slice(0, 1) ?? "D"}
            </Text>
          </View>
        )}

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{driver?.fullName ?? "Driver"}</Text>
          <Text style={styles.contact}>{driver?.email ?? "Not signed in"}</Text>
          {!!driver?.phoneNumber && (
            <Text style={styles.contact}>{driver.phoneNumber}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editIcon} onPress={startEditing}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bus-outline" size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Bus Details</Text>
        </View>

        <Row label="Bus Plate Number" value={bus?.numberPlate} />
        <Row label="Bus Number" value={bus?.companyBusNumber} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people-outline" size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Bus Staff</Text>
        </View>

        <Row label="Staff Name" value={bus?.staff?.[0]?.staffName} />
        <Row label="Staff Phone" value={bus?.staff?.[0]?.staffPhone} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Weekly Routes</Text>
        </View>

        {dayLabels.map(({ key, label }) => (
          <Row key={key} label={label} value={scheduleByDay[key] || "Off"} />
        ))}
      </View>

      <CustomButton title="Edit Profile" onPress={startEditing} />

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 12,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },

  avatarPlaceholder: {
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: Colors.primary,
    fontWeight: "900",
    fontSize: 26,
  },

  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },

  editIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },

  contact: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  rowLabel: {
    color: Colors.textSecondary,
  },

  rowValue: {
    color: Colors.text,
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  half: {
    flex: 1,
  },
});
