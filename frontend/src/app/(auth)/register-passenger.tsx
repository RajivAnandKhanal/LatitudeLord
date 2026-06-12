import { useState } from "react";

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";
import ProgressSteps from "../../components/common/ProgressSteps";

import { Colors } from "../../theme/colors";

export default function RegisterPassengerScreen() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  const [healthCondition, setHealthCondition] = useState("");

  const [photo, setPhoto] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function previousStep() {
    setStep((prev) => prev - 1);
  }

  function submitForm() {
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    console.log({
      role: "PASSENGER",
      name,
      email,
      gender,
      healthCondition,
      photo,
      password,
    });

    Alert.alert(
      "Registration Complete",
      "Passenger registration data ready for backend.",
    );
  }

  return (
    <AuthScreen>
      <PageHeader title="Passenger Registration" />

      <ProgressSteps total={3} current={step} />

      {step === 1 && (
        <View>
          <Text style={styles.heading}>Personal Information</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Gender"
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.heading}>Additional Information</Text>

          <TextInput
            placeholder="Health Condition"
            style={styles.input}
            value={healthCondition}
            onChangeText={setHealthCondition}
          />

          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoText}>Upload Profile Photo</Text>
          </TouchableOpacity>

          {!!photo && <Image source={{ uri: photo }} style={styles.image} />}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={previousStep}
            >
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButtonHalf}
              onPress={nextStep}
            >
              <Text style={styles.primaryText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.heading}>Security</Text>

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={previousStep}
            >
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButtonHalf}
              onPress={submitForm}
            >
              <Text style={styles.primaryText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 24,
  },

  input: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  photoButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  photoText: {
    color: Colors.primary,
    fontWeight: "700",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  primaryButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  primaryButtonHalf: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  secondaryButton: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  secondaryText: {
    color: Colors.text,
    fontWeight: "700",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 20,
  },
});
