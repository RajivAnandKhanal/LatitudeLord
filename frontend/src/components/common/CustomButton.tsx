import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "danger" | "secondary";
}

export default function CustomButton({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "danger" && styles.danger,
        variant === "secondary" && styles.secondary,
        isDisabled && styles.disabled,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.55,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  secondary: {
    backgroundColor: "#E2E8F0",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryText: {
    color: Colors.text,
  },
});
