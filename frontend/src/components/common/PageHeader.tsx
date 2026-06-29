import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../theme/colors";

interface Props {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showBackButton = false,
}: Props) {
  const { user } = useAuth();

  function goHome() {
    if (!user) {
      router.replace("/(guest)/home");
      return;
    }

    if (user.role === "passenger") {
      router.replace("/(passenger)/home");
      return;
    }

    if (user.role === "driver") {
      router.replace("/(driver)/dashboard");
      return;
    }

    router.replace("/(public)/landing");
  }

  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.logoMark}>
          <Ionicons name="bus" size={20} color="#FFFFFF" />
        </View>
      )}

      <TouchableOpacity
        style={styles.titleBlock}
        activeOpacity={0.85}
        onPress={goHome}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle ?? "LatitudeLord"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  titleBlock: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.text,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
