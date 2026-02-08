export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'

export const URL = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh-token',
  UPDATE_PHONE: 'auth/update-phone',
  ME: 'auth/me',
  USER_ME: 'user/me',
  CHANGE_PASSWORD: 'user/update-password',
  UPDATE_PROFILE: 'user/me/update-profile',

  ORDERS: 'orders',

  TABLES: 'catalog/tables',
  TABLES_EMPTY: 'catalog/tables/empty',
  MENU_GROUP_TYPES_AVAILABLE: 'catalog/menus/groups/available',
  MENUS_GROUP_BASE: 'catalog/menus/groups',
  MENU_SIZES_BASE: 'catalog/menus'
} as const
