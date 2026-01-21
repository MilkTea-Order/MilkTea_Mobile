export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'

export const URL = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh-token',
  UPDATE_PHONE: 'auth/update-phone',
  ME: 'auth/me',
  USER_ME: 'user/me',
  CHANGE_PASSWORD: 'user/update-password',
  UPDATE_PROFILE: 'user/me/update-profile',
  ORDERS: 'orders',
  TABLES: 'tables',
  MENU_GROUP_TYPES: 'menus/groups/avaliable',
  MENUS_GROUP_BASE: 'menus/groups',
  MENU_SIZES_BASE: 'menus'
} as const
