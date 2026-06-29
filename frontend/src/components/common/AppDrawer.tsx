import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComponentProps } from "react";

import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../theme/colors";
import { DriverUser, PassengerUser } from "../../types/auth";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Item = {
  label: string;
  icon: IconName;
  route: Href;
};

export default function AppDrawer({
  items,
  subtitle,
}: {
  items: Item[];
  subtitle: string;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const fullName =
    user?.role === "passenger" || user?.role === "driver"
      ? (user as PassengerUser | DriverUser).fullName
      : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 14 }}>

        {/* HEADER */}
        <View style={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "900", color: Colors.primary }}>
            LatitudeLord
          </Text>

          <Text style={{ marginTop: 4, color: Colors.textSecondary }}>
            {subtitle}
          </Text>

          <Text style={{ marginTop: 6, fontSize: 12, color: Colors.textSecondary }}>
            {fullName ?? "User"}
          </Text>
        </View>

        {/* MENU */}
      {items.map((item) => {
  const active = pathname === item.route;

  return (
    <Pressable
      key={item.label}
      onPress={() => router.push(item.route)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        backgroundColor: active ? "#EAF2FF" : "transparent",
      }}
    >
              <Ionicons
                name={item.icon}
                size={22}
                color={active ? Colors.primary : Colors.textSecondary}
              />

              <Text
                style={{
                  marginLeft: 12,
                  fontWeight: "700",
                  color: active ? Colors.primary : Colors.text,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        {/* LOGOUT */}
        <View
          style={{
            marginTop: 20,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            paddingTop: 16,
          }}
        >
          <Pressable
            onPress={logout}
            style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
          >
            <Ionicons name="log-out-outline" size={22} color="red" />
            <Text style={{ marginLeft: 12, color: "red", fontWeight: "700" }}>
              Logout
            </Text>
          </Pressable>

          <Text style={{ marginTop: 10, fontSize: 12, color: Colors.textSecondary }}>
            LatitudeLord v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}