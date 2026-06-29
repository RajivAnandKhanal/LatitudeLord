import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
}

export default function MenuCard({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
