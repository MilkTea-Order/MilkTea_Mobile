export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

export const URL = {
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  LOGOUT: "auth/logout",
  REFRESH_TOKEN: "auth/refresh-token",
  UPDATE_PHONE: "auth/update-phone",
  ME: "auth/me",
} as const;
