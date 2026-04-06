export const BASE_URL = process.env.EXPO_PUBLIC_API_URL

export const URL = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh-token',
  CHANGE_PASSWORD: 'auth/update-password',

  // Forgot Password
  FORGOT_PASSWORD: 'auth/forgot-password',
  FORGOT_PASSWORD_VERIFY: 'auth/forgot-password/verify',
  FORGOT_PASSWORD_RESEND: 'auth/forgot-password/resend',
  FORGOT_PASSWORD_RESET: 'auth/forgot-password/reset',

  USER_LIST: 'users',
  USER_ME: 'users/me',
  UPDATE_PROFILE: 'users/me/update-profile',

  ORDERS: 'orders',

  TABLES: 'catalog/tables',
  TABLES_EMPTY: 'catalog/tables/empty',

  MENU_GROUP_TYPES_AVAILABLE: 'catalog/menus/groups/available',
  MENUS_GROUP_BASE: 'catalog/menus/groups',
  MENUS_AVAILABLE_BASE: 'catalog/menus/items/available',
  MENU_SIZES_BASE: 'catalog/menus',

  MATERIAL_INVENTORY_REPORT: 'inventory/report',
  REVENUE_REPORT: 'orders/report',

  FINANCE: 'finance'
} as const
