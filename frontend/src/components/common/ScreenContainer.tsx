import React from "react";

import { StyleSheet, View } from "react-native";

import { Colors } from "../../theme/colors";

interface Props {
  children: React.ReactNode;
}

export default function ScreenContainer({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
