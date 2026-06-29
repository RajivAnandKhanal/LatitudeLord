import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Colors } from "../../theme/colors";

interface Props extends Pick<
  TextInputProps,
  "autoCapitalize" | "textContentType"
> {
  label?: string;
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onChangeText?: (value: string) => void;
}

export default function CustomInput({
  label,
  value,
  placeholder,
  secureTextEntry,
  multiline,
  editable = true,
  error,
  keyboardType,
  returnKeyType = "next",
  autoCapitalize = "sentences",
  textContentType,
  onChangeText,
}: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrap}>
        <TextInput
          style={[
            styles.input,
            isPassword && styles.passwordInput,
            multiline && styles.textArea,
            !editable && styles.inputDisabled,
            !!error && styles.inputError,
          ]}
          value={value}
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          blurOnSubmit={!multiline}
          onChangeText={onChangeText}
        />

        {isPassword && !multiline && (
          <TouchableOpacity
            style={styles.eyeButton}
            activeOpacity={0.75}
            onPress={() => setPasswordVisible((current) => !current)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: Colors.text,
    fontWeight: "600",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 0,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  inputError: {
    borderColor: Colors.danger,
  },
  inputDisabled: {
    backgroundColor: "#F1F5F9",
    color: Colors.textSecondary,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  error: {
    color: Colors.danger,
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});
