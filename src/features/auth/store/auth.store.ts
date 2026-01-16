import {
  getItem,
  getObject,
  removeItem,
  setItem,
  setObject,
} from "@/shared/storage/secure-storage";
import { create } from "zustand";
import { AUTH_KEYS } from "../constants/auth.keys";
import { Permission } from "../types/permission.type";
import { User } from "../types/user.type";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Permission[] | null;
  expiresAt: string | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  setAuthData: (data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    permissions?: Permission[];
  }) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  clearAuthData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: null,
  expiresAt: null,
  isHydrating: true,
  isAuthenticated: false,
  error: null,

  hydrate: async () => {
    try {
      set({ isHydrating: true, error: null });

      const [accessToken, refreshToken, user] = await Promise.all([
        getItem(AUTH_KEYS.ACCESS_TOKEN),
        getItem(AUTH_KEYS.REFRESH_TOKEN),
        getObject<User>(AUTH_KEYS.USER),
      ]);
      if (accessToken && user) {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      } else {
        set({ isAuthenticated: false });
      }

      set({ isHydrating: false });
    } catch {
      set({
        error: "Failed to load session",
        isHydrating: false,
      });
    }
  },

  setAuthData: async (data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    permissions?: Permission[];
  }) => {
    const { user, accessToken, refreshToken, expiresAt, permissions } = data;

    set({
      user,
      accessToken,
      refreshToken: refreshToken || null,
      expiresAt: expiresAt || null,
      permissions: permissions || null,
      isAuthenticated: true,
      error: null,
    });

    const promises = [
      setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken),
      setObject(AUTH_KEYS.USER, user),
    ];

    if (refreshToken) {
      promises.push(setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken));
    }

    await Promise.all(promises);
  },

  setUser: async (user: User) => {
    set({ user });

    await setObject(AUTH_KEYS.USER, user);
  },

  clearAuthData: async () => {
    // Clear Zustand state
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: null,
      expiresAt: null,
      isAuthenticated: false,
      error: null,
    });

    await Promise.all([
      removeItem(AUTH_KEYS.ACCESS_TOKEN),
      removeItem(AUTH_KEYS.REFRESH_TOKEN),
      removeItem(AUTH_KEYS.USER),
    ]);
  },
}));
