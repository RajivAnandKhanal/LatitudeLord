import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../theme/colors";

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  onChange: (value: string) => void;
}

export default function FormSelect({
  label,
  value,
  placeholder,
  options,
  error,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.trigger, !!error && styles.triggerError]}
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder ?? "Select option"}
        </Text>
        <Text style={styles.chevron}>v</Text>
      </TouchableOpacity>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>

            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  option.value === value && styles.activeOption,
                ]}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  trigger: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerError: {
    borderColor: Colors.danger,
  },
  triggerText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  placeholder: {
    color: Colors.textSecondary,
    fontWeight: "400",
  },
  chevron: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  error: {
    color: Colors.danger,
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: Colors.text,
  },
  option: {
    minHeight: 52,
    justifyContent: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  activeOption: {
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "600",
  },
});
