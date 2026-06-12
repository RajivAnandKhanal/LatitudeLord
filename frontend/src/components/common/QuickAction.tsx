
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress?: () => void;
}

export default function QuickAction({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    marginHorizontal: 4,
  },

  text: {
    fontWeight: "700",
    color: Colors.text,
  },
});
