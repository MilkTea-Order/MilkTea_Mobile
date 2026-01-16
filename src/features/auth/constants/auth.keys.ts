/**
 * Auth-specific storage keys
 * Re-export from shared storage keys for convenience
 */

import { STORAGE_KEYS } from "@/shared/storage/storage.keys";

export const AUTH_KEYS = {
  ACCESS_TOKEN: STORAGE_KEYS.AUTH.ACCESS_TOKEN,
  REFRESH_TOKEN: STORAGE_KEYS.AUTH.REFRESH_TOKEN,
  USER: STORAGE_KEYS.AUTH.USER,
} as const;
