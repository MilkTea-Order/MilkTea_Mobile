export const STORAGE_KEYS = {
  // Auth keys
  AUTH: {
    TOKENS: 'auth_tokens',
    PROFILE: 'auth_profile',
    USERNAME: 'auth_username',
    REMEMBER_USERNAME: 'auth_remember_username'
  },
  // Settings keys
  SETTINGS: {
    THEME_MODE: 'settings_theme_mode',
    LANGUAGE: 'settings_language'
  },
  // Onboarding keys
  ONBOARDING: {
    COMPLETED: 'onboarding_completed'
  }
} as const
