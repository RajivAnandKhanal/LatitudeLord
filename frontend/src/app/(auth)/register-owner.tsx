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

export default function RegisterOwnerScreen() {
  const [step, setStep] = useState(1);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [busPlate, setBusPlate] = useState("");
  const [busNumber, setBusNumber] = useState("");

  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverPhoto, setDriverPhoto] = useState("");

  const [weeklyRoute, setWeeklyRoute] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setDriverPhoto(result.assets[0].uri);
    }
  }

  function submitForm() {
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    console.log({
      role: "OWNER",
      ownerName,
      ownerEmail,
      ownerPhone,
      busPlate,
      busNumber,
      driverName,
      driverPhone,
      driverPhoto,
      weeklyRoute,
      password,
    });

    Alert.alert("Success", "Owner registration ready for backend.");
  }

  return (
    <AuthScreen>
      <PageHeader title="Bus Owner Registration" />

      <ProgressSteps total={4} current={step} />

      {step === 1 && (
        <>
          <Text style={styles.heading}>Owner Information</Text>

          <TextInput
            placeholder="Owner Name"
            style={styles.input}
            value={ownerName}
            onChangeText={setOwnerName}
          />

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={ownerEmail}
            onChangeText={setOwnerEmail}
          />

          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={ownerPhone}
            onChangeText={setOwnerPhone}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.heading}>Bus Information</Text>

          <TextInput
            placeholder="Bus Number Plate"
            style={styles.input}
            value={busPlate}
            onChangeText={setBusPlate}
          />

          <TextInput
            placeholder="Bus Number"
            style={styles.input}
            value={busNumber}
            onChangeText={setBusNumber}
          />

          <View style={styles.row}>
            <BackButton onPress={() => setStep(1)} />
            <NextButton onPress={() => setStep(3)} />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.heading}>Driver Information</Text>

          <TextInput
            placeholder="Driver Name"
            style={styles.input}
            value={driverName}
            onChangeText={setDriverName}
          />

          <TextInput
            placeholder="Driver Phone"
            style={styles.input}
            value={driverPhone}
            onChangeText={setDriverPhone}
          />

          <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
            <Text style={styles.photoText}>Upload Driver Photo</Text>
          </TouchableOpacity>

          {!!driverPhoto && (
            <Image source={{ uri: driverPhoto }} style={styles.image} />
          )}

          <View style={styles.row}>
            <BackButton onPress={() => setStep(2)} />
            <NextButton onPress={() => setStep(4)} />
          </View>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.heading}>Route & Security</Text>

          <TextInput
            placeholder="7 Day Route Schedule"
            style={styles.input}
            value={weeklyRoute}
            onChangeText={setWeeklyRoute}
          />

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

          <View style={styles.row}>
            <BackButton onPress={() => setStep(3)} />
            <NextButton title="Create Account" onPress={submitForm} />
          </View>
        </>
      )}
    </AuthScreen>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryText}>Back</Text>
    </TouchableOpacity>
  );
}

function NextButton({
  onPress,
  title = "Continue",
}: {
  onPress: () => void;
  title?: string;
}) {
  return (
    <TouchableOpacity style={styles.primaryButtonHalf} onPress={onPress}>
      <Text style={styles.primaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: Colors.text,
  },

  input: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    marginBottom: 16,
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
    marginVertical: 20,
    alignSelf: "center",
  },

  primaryButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonHalf: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#FFF",
    fontWeight: "700",
  },

  secondaryText: {
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    marginTop: 16,
  },
});
