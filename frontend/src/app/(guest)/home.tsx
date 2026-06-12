import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/common/AppHeader";
import AppLogo from "../../components/common/AppLogo";
import BusCard from "../../components/common/BusCard";
import { buses } from "../../mock/buses";
import { Colors } from "../../theme/colors";

export default function GuestHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Guest Mode" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <AppLogo />

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Nearby Buses</Text>
            <Text style={styles.heroText}>
              Find buses around your location.
            </Text>
          </View>

          <TextInput placeholder="Search by station..." style={styles.search} />

          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} onPress={() => {}} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    padding: 20,
    paddingTop: 10,
  },

  hero: {
    marginVertical: 24,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
  },

  heroText: {
    color: Colors.textSecondary,
    marginTop: 6,
  },

  search: {
    backgroundColor: "#FFF",
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});
