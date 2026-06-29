import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";


export default function DrawerMenu() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LatitudeLord</Text>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/")}>
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/about")}
      >
        <Text>About Developers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/feedback")}
      >
        <Text>Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },

  logo: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 30,
  },

  item: {
    paddingVertical: 16,
  },
});
