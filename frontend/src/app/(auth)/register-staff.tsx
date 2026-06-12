import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import AuthHeader from "../../components/common/AuthHeader";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import PageHeader from "../../components/common/PageHeader";
import ScreenContainer from "../../components/common/ScreenContainer";
import ImagePickerField from "../../components/forms/ImagePickerField";

export default function RegisterStaff() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    experience: "",
    healthCondition: "",
    emergencyContact: "",
    photo: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Bus Staff Registration" />
        <AuthHeader />

        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <CustomInput
          label="Full Name"
          value={form.name}
          onChangeText={(v) => update("name", v)}
        />

        <CustomInput
          label="Email"
          value={form.email}
          onChangeText={(v) => update("email", v)}
        />

        <CustomInput
          label="Phone Number"
          value={form.phone}
          onChangeText={(v) => update("phone", v)}
        />

        <CustomInput
          label="Gender"
          value={form.gender}
          onChangeText={(v) => update("gender", v)}
        />

        <CustomInput
          label="Address"
          value={form.address}
          onChangeText={(v) => update("address", v)}
        />

        {/* Work Info */}
        <Text style={styles.sectionTitle}>Work Information</Text>

        <CustomInput
          label="Experience (years)"
          value={form.experience}
          onChangeText={(v) => update("experience", v)}
        />

        <CustomInput
          label="Health Condition"
          value={form.healthCondition}
          onChangeText={(v) => update("healthCondition", v)}
        />

        <CustomInput
          label="Emergency Contact"
          value={form.emergencyContact}
          onChangeText={(v) => update("emergencyContact", v)}
        />

        <ImagePickerField
          label="Profile Photo"
          onImageSelected={(uri) => update("photo", uri)}
        />

        {/* Account Info */}
        <Text style={styles.sectionTitle}>Account Security</Text>

        <CustomInput
          label="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => update("password", v)}
        />

        <CustomInput
          label="Confirm Password"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(v) => update("confirmPassword", v)}
        />

        <CustomButton
          title="Create Account"
          onPress={() => console.log(form)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    padding: 24,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
});
