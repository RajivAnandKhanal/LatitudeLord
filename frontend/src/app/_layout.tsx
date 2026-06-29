import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "../context/AuthContext";
import { JourneyProvider } from "../context/JourneyContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <JourneyProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </JourneyProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
