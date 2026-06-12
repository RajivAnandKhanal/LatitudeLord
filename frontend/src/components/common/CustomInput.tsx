
import { StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
}

export default function CustomInput({
  label,
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,

    color: Colors.text,

    fontWeight: "600",
  },

  input: {
    height: 56,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    borderWidth: 1,

    borderColor: Colors.border,

    paddingHorizontal: 16,

    fontSize: 16,
  },
});
