import { ProtectedRoute } from "@/components/layouts/ProtectedRoute";
import { useTheme } from "@/shared/hooks/useTheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { effectiveTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={effectiveTheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <ProtectedRoute>
          <Stack>
            <Stack.Screen
              name="login"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />
        </ProtectedRoute>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
