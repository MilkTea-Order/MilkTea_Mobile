import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        // Simulate API call - replace with actual API later
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock login - accept any username/password for now
        if (username && password) {
          set({
            isAuthenticated: true,
            user: {
              id: "1",
              name: "Quản lý Quán",
              email: username,
              avatar: undefined,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
