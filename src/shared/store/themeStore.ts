import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { THEME_MODE, type ThemeMode } from "../constants/theme";

interface ThemeState {
  themeMode: ThemeMode; // User selection: light | dark | system
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: THEME_MODE.SYSTEM,
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
