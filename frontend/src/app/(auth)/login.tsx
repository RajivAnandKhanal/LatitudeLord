import { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import AuthScreen from "../../components/common/AuthScreen";
import PageHeader from "../../components/common/PageHeader";

import { Colors } from "../../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    console.log({
      email,
      password,
    });

    // later backend integration
  }

  return (
    <AuthScreen>
      <PageHeader title="Login" />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome Back</Text>

        <Text style={styles.heroDescription}>
          Access your LatitudeLord account and continue tracking buses.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>

        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register-role")}>
          <Text style={styles.registerText}>
            Don't have an account? Create one
          </Text>
        </TouchableOpacity>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 24,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
  },

  heroDescription: {
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
  },

  label: {
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
  },

  loginButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  registerText: {
    textAlign: "center",
    marginTop: 18,
    color: Colors.primary,
    fontWeight: "600",
  },
});
