import { StyleSheet, Text } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
    marginTop: 10,
  },
});
