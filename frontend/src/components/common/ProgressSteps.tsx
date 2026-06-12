
import { StyleSheet, View } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  total: number;
  current: number;
}

export default function ProgressSteps({ total, current }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, current >= index + 1 && styles.activeDot]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 24,
  },

  dot: {
    width: 12,
    height: 12,

    borderRadius: 100,

    backgroundColor: "#CBD5E1",

    marginRight: 8,
  },

  activeDot: {
    backgroundColor: Colors.primary,
  },
});
