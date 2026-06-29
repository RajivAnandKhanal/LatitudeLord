import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AuthScreen from "../../components/common/AuthScreen";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import FormStatus from "../../components/common/FormStatus";
import PageHeader from "../../components/common/PageHeader";

import { useAuth } from "../../hooks/useAuth";
import { mockUsers } from "../../mock/users";
import { Colors } from "../../theme/colors";
import { validateEmail, validateRequired } from "../../utils/validation";

type FormStatusState = {
  type: "success" | "error";
  title: string;
  message: string;
};

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FormStatusState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleLogin() {
    const nextErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!validateRequired(password)) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        title: "Check login details",
        message: "Please fix the highlighted fields before continuing.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundUser = mockUsers.find(
        (item) =>
          item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          item.password === password,
      );

      if (!foundUser) {
        setStatus({
          type: "error",
          title: "Login failed",
          message: "Invalid email or password.",
        });
        return;
      }

      await login(foundUser);

      setStatus({
        type: "success",
        title: "Welcome back",
        message: "Redirecting to your dashboard.",
      });

      if (foundUser.role === "passenger") {
        router.replace("/(passenger)/home");
        return;
      }

      router.replace("/(driver)/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen>
      <PageHeader title="Login" showBackButton />

      <View style={styles.card}>
        <Text style={styles.heading}>Welcome Back</Text>

        <Text style={styles.subheading}>
          Login to continue using LatitudeLord
        </Text>

        {status && (
          <FormStatus
            type={status.type}
            title={status.title}
            message={status.message}
          />
        )}

        <CustomInput
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          error={errors.email}
          onChangeText={setEmail}
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          textContentType="password"
          returnKeyType="done"
          error={errors.password}
          onChangeText={setPassword}
        />

        <CustomButton
          title="Login"
          loading={loading}
          disabled={loading}
          onPress={handleLogin}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={() => router.push("/(auth)/register-role")}
        >
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>

          <Text style={styles.demoText}>passenger@latitudelord.com</Text>
          <Text style={styles.demoText}>Password: Passenger123</Text>

          <Text style={styles.demoText}>driver@latitudelord.com</Text>
          <Text style={styles.demoText}>Password: Driver123</Text>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },

  subheading: {
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.primary,
    fontWeight: "600",
  },

  demoBox: {
    marginTop: 24,
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
  },

  demoTitle: {
    fontWeight: "700",
    marginBottom: 10,
    color: Colors.text,
  },

  demoText: {
    marginBottom: 4,
    color: Colors.textSecondary,
  },
});
