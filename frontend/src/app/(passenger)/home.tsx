import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { router } from "expo-router";

import AppLogo from "../../components/common/AppLogo";
import BusCard from "../../components/common/BusCard";
import QuickAction from "../../components/common/QuickAction";
import SectionHeader from "../../components/common/SectionHeader";

import { buses } from "../../mock/buses";
import { Colors } from "../../theme/colors";

export default function PassengerHomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <AppLogo />

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome Back</Text>

          <Text style={styles.heroText}>
            Track buses, chat with staff and manage your journey.
          </Text>
        </View>

        <View style={styles.actions}>
          <QuickAction
            title="Profile"
            onPress={() => router.push("/(passenger)/profile")}
          />

          <QuickAction
            title="Chat"
            onPress={() => router.push("/(passenger)/chat")}
          />

          <QuickAction
            title="Support"
            onPress={() => router.push("/(passenger)/support")}
          />
        </View>

        <TextInput placeholder="Search station..." style={styles.search} />

        <SectionHeader title="Nearby Buses" />

        {buses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            onPress={() => router.push("/(passenger)/bus-details")}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
  },

  hero: {
    backgroundColor: "#DBEAFE",
    borderRadius: 24,
    padding: 20,
    marginVertical: 20,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  heroText: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  actions: {
    flexDirection: "row",
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#FFF",
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
});
