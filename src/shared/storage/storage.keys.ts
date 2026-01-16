/**
 * All storage keys used across the app
 * Centralized key management for easy maintenance
 */

export const STORAGE_KEYS = {
  // Auth keys
  AUTH: {
    ACCESS_TOKEN: "auth_access_token",
    REFRESH_TOKEN: "auth_refresh_token",
    USER: "auth_user",
  },
  // Settings keys
  SETTINGS: {
    THEME_MODE: "settings_theme_mode",
    LANGUAGE: "settings_language",
  },
  // Onboarding keys
  ONBOARDING: {
    COMPLETED: "onboarding_completed",
  },
} as const;
