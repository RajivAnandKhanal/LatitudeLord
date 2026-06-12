
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
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

  text: {
    color: "#FFFFFF",

    fontWeight: "700",

    fontSize: 16,
  },
});
