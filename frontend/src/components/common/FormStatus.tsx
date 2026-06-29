import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";

type StatusType = "success" | "error" | "info";

interface Props {
  type: StatusType;
  title: string;
  message: string;
}

export default function FormStatus({ type, title, message }: Props) {
  return (
    <View style={[styles.card, styles[type]]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
  },
  success: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  error: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  info: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
  },
  title: {
    color: Colors.text,
    fontWeight: "800",
    marginBottom: 4,
  },
  message: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
