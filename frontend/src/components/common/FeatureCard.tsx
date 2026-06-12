
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../theme/colors";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export default function FeatureCard({ icon, title }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={28} color={Colors.primary} />

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    minHeight: 120,

    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    padding: 18,
  },

  title: {
    marginTop: 12,

    textAlign: "center",

    fontWeight: "600",

    color: Colors.text,
  },
});
