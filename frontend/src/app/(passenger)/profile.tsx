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
import FormSelect from "../../components/common/FormSelect";
import PageHeader from "../../components/common/PageHeader";
import ImagePickerField from "../../components/forms/ImagePickerField";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../theme/colors";
import { PassengerUser } from "../../types/auth";
import { validateName } from "../../utils/validation";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const menuItems: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  {
    title: "Journey History",
    icon: "time-outline",
    route: "/(passenger)/trips",
  },
  {
    title: "Settings",
    icon: "settings-outline",
    route: "/(passenger)/settings",
  },
  {
    title: "Support",
    icon: "help-circle-outline",
    route: "/(passenger)/support",
  },
  {
    title: "Bug Report / Feedback",
    icon: "chatbox-ellipses-outline",
    route: "/feedback",
  },
  {
    title: "About Project Developers",
    icon: "information-circle-outline",
    route: "/about",
  },
];

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const passenger = user?.role === "passenger" ? (user as PassengerUser) : null;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fullName, setFullName] = useState(passenger?.fullName ?? "");
  const [gender, setGender] = useState(passenger?.gender ?? "");
  const [healthCondition, setHealthCondition] = useState(
    passenger?.healthCondition ?? "",
  );
  const [photoUrl, setPhotoUrl] = useState(passenger?.photoUrl ?? "");

  function startEditing() {
    setFullName(passenger?.fullName ?? "");
    setGender(passenger?.gender ?? "");
    setHealthCondition(passenger?.healthCondition ?? "");
    setPhotoUrl(passenger?.photoUrl ?? "");
    setErrors({});
    setEditing(true);
  }

  async function saveChanges() {
    const nextErrors: Record<string, string> = {};

    if (!validateName(fullName)) {
      nextErrors.fullName = "Enter your full name.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      await updateUser({
        fullName: fullName.trim(),
        gender,
        healthCondition,
        photoUrl,
      });

      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
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

        <ImagePickerField label="Profile Photo" onImageSelected={setPhotoUrl} />

        <CustomInput
          label="Email Address"
          value={passenger?.email}
          editable={false}
        />

        <CustomInput
          label="Full Name"
          value={fullName}
          error={errors.fullName}
          onChangeText={setFullName}
        />

        <FormSelect
          label="Gender"
          value={gender}
          placeholder="Select gender"
          options={genderOptions}
          onChange={setGender}
        />

        <CustomInput
          label="Health Condition"
          placeholder="e.g., physical disability, seat reservation needed"
          value={healthCondition}
          onChangeText={setHealthCondition}
        />

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
      <PageHeader title="My Profile" subtitle="Passenger Account" />

      <View style={styles.profileCard}>
        {passenger?.photoUrl ? (
          <Image source={{ uri: passenger.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {passenger?.fullName?.slice(0, 1) ?? "P"}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{passenger?.fullName ?? "Passenger"}</Text>
        <Text style={styles.email}>
          {passenger?.email ?? "Not signed in"}
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Passenger</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={startEditing}>
          <Ionicons name="create-outline" size={16} color={Colors.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>
            {passenger?.gender || "Not provided"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Health Condition</Text>
          <Text style={styles.value}>
            {passenger?.healthCondition || "Not provided"}
          </Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color={Colors.primary} />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.85}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  avatarPlaceholder: {
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.primary,
  },

  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },

  email: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  badge: {
    marginTop: 12,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
  },

  badgeText: {
    color: Colors.primary,
    fontWeight: "800",
  },

  editButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  editButtonText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  value: {
    color: Colors.text,
    fontWeight: "700",
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  menuItem: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },

  logoutButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "800",
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
