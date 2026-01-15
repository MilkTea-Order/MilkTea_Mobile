import { useColorScheme } from "react-native";
import { Colors, gradientColors, statusColors } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const effectiveTheme: "light" | "dark" =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const isDark = effectiveTheme === "dark";
  const colors = Colors[effectiveTheme];
  const gradients = gradientColors[effectiveTheme];
  const status = statusColors;

  return {
    themeMode,
    effectiveTheme,
    setThemeMode,
    isDark,
    colors,
    gradients,
    status,
  };
}
