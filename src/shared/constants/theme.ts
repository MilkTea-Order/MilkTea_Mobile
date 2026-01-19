/**
 * Theme colors for Milk Tea Shop App
 * Centralized color system for light and dark modes
 * Warm, soft color palette - Orange/Amber theme (softer and more comfortable)
 */

import { Platform } from 'react-native'
import { STATUS, type OrderStatus } from './status'

// Theme mode options - user selection (includes system mode)
export const THEME_MODE = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  SYSTEM: 'system' as const
} as const

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE]

// Theme variant - actual theme values (light/dark only, no system)
export const THEME_VARIANT = {
  LIGHT: THEME_MODE.LIGHT,
  DARK: THEME_MODE.DARK
} as const

export type ThemeVariant = (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT]

// Primary color palette - Orange/Amber theme (softer and more comfortable)
export const primaryColors = {
  primary: '#FB923C', // Orange-400 - base primary color
  primaryLight: '#FDBA74', // Orange-300 - lighter variant (sáng hơn)
  primaryDark: '#F97316', // Orange-500 - darker variant (tối hơn)
  secondary: '#FBBF24', // Amber-400 - base secondary color
  secondaryLight: '#FCD34D', // Amber-300 - lighter variant (sáng hơn)
  secondaryDark: '#F59E0B' // Amber-500 - darker variant (tối hơn)
}

// Gradient colors - soft orange/amber gradients
export const gradientColors: Record<
  ThemeVariant,
  {
    primary: readonly [string, string, string]
    header: readonly [string, string]
    card: readonly [string, string]
  }
> = {
  [THEME_VARIANT.LIGHT]: {
    primary: ['#FFFFFF', '#FFF7ED', '#FFEDD5'] as const, // White to Orange-50 to Orange-100
    header: ['#FB923C', '#FBBF24'] as const, // Orange-400 to Amber-400 (softer)
    card: ['#FFFFFF', '#FFFFFF'] as const // White to White
  },
  [THEME_VARIANT.DARK]: {
    primary: ['#7C2D12', '#9A3412', '#C2410C'] as const, // Orange-900 to Orange-800 to Orange-700
    header: ['#F97316', '#FB923C'] as const, // Orange-500 to Orange-400
    card: ['#1E293B', '#7C2D12'] as const // Slate-800 to Orange-900
  }
}

// Status color type
type StatusColorTheme = {
  bg: string
  border: string
  text: string
  badge: string
}

type StatusColor = {
  [K in ThemeVariant]: StatusColorTheme
} & {
  icon: string
}

export const statusColors: Record<OrderStatus, StatusColor> = {
  [STATUS.ORDER.PENDING]: {
    [THEME_VARIANT.LIGHT]: {
      bg: '#FEF3C7', // Amber-100
      border: '#FCD34D', // Amber-300
      text: '#92400E', // Amber-800
      badge: '#FDE68A' // Amber-200
    },
    [THEME_VARIANT.DARK]: {
      bg: '#78350F', // Amber-900/20
      border: '#F59E0B', // Amber-500
      text: '#FCD34D', // Amber-300
      badge: '#92400E' // Amber-800
    },
    icon: '#F59E0B' // Amber-500
  },
  [STATUS.ORDER.PREPARING]: {
    [THEME_VARIANT.LIGHT]: {
      bg: '#FED7AA', // Orange-200
      border: '#FDBA74', // Orange-300
      text: '#9A3412', // Orange-800
      badge: '#FFEDD5' // Orange-100
    },
    [THEME_VARIANT.DARK]: {
      bg: '#7C2D12', // Orange-900/20
      border: '#FB923C', // Orange-400
      text: '#FDBA74', // Orange-300
      badge: '#9A3412' // Orange-800
    },
    icon: '#FB923C' // Orange-400
  },
  [STATUS.ORDER.READY]: {
    [THEME_VARIANT.LIGHT]: {
      bg: '#D1FAE5', // Emerald-100
      border: '#6EE7B7', // Emerald-300
      text: '#065F46', // Emerald-800
      badge: '#A7F3D0' // Emerald-200
    },
    [THEME_VARIANT.DARK]: {
      bg: '#064E3B', // Emerald-900/20
      border: '#10B981', // Emerald-500
      text: '#6EE7B7', // Emerald-300
      badge: '#065F46' // Emerald-800
    },
    icon: '#10B981' // Emerald-500
  },
  [STATUS.ORDER.COMPLETED]: {
    [THEME_VARIANT.LIGHT]: {
      bg: '#F3F4F6', // Gray-100
      border: '#D1D5DB', // Gray-300
      text: '#374151', // Gray-700
      badge: '#E5E7EB' // Gray-200
    },
    [THEME_VARIANT.DARK]: {
      bg: '#374151', // Gray-700/30
      border: '#6B7280', // Gray-500
      text: '#D1D5DB', // Gray-300
      badge: '#4B5563' // Gray-600
    },
    icon: '#6B7280' // Gray-500
  }
}

// Color theme type
export type ColorTheme = {
  // Base colors
  background: string
  surface: string
  card: string
  // Text colors
  text: string
  textSecondary: string
  textTertiary: string
  // Border colors
  border: string
  borderLight: string
  // Primary colors
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  // Semantic colors
  success: string
  warning: string
  error: string
  info: string
  // Navigation
  tint: string
  icon: string
  tabIconDefault: string
  tabIconSelected: string
}

// Main theme colors with improved contrast
export const Colors: Record<ThemeVariant, ColorTheme> = {
  [THEME_VARIANT.LIGHT]: {
    // Base colors
    background: '#FFFFFF', // Pure white
    surface: '#FFFFFF', // Pure white
    card: '#FFFFFF', // Pure white

    // Text colors - maximum contrast for better readability
    text: '#000000', // Pure black - maximum contrast
    textSecondary: '#1E293B', // Slate-800 - very high contrast
    textTertiary: '#475569', // Slate-600 - high contrast

    // Border colors - more visible
    border: '#CBD5E1', // Slate-300 - more visible borders
    borderLight: '#E2E8F0', // Slate-200

    // Primary colors - softer
    primary: primaryColors.primary,
    primaryLight: primaryColors.primaryLight,
    primaryDark: primaryColors.primaryDark,
    secondary: primaryColors.secondary,

    // Semantic colors
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    info: '#3B82F6', // Blue-500

    // Navigation
    tint: primaryColors.primary,
    icon: '#1E293B', // Slate-800 - very high contrast
    tabIconDefault: '#475569', // Slate-600 - high contrast
    tabIconSelected: primaryColors.primary
  },
  [THEME_VARIANT.DARK]: {
    // Base colors - improved contrast
    background: '#0F172A', // Slate-950
    surface: '#1E293B', // Slate-800
    card: '#1E293B', // Slate-800

    // Text colors - improved contrast for dark mode
    text: '#F8FAFC', // Slate-50 - brighter for better contrast
    textSecondary: '#CBD5E1', // Slate-300 - brighter secondary text
    textTertiary: '#94A3B8', // Slate-400

    // Border colors - more visible in dark mode
    border: '#475569', // Slate-600 - brighter border
    borderLight: '#334155', // Slate-700

    // Primary colors - use lighter variants for dark mode (brighter on dark bg)
    primary: primaryColors.primaryLight, // Orange-300 - brighter for dark bg
    primaryLight: '#FED7AA', // Orange-200 - even brighter
    primaryDark: primaryColors.primary, // Orange-400 - darker variant
    secondary: primaryColors.secondaryLight, // Amber-300 - brighter for dark bg

    // Semantic colors
    success: '#34D399', // Emerald-400 - brighter for dark mode
    warning: '#FBBF24', // Amber-400 - brighter
    error: '#F87171', // Red-400 - brighter
    info: '#60A5FA', // Blue-400 - brighter

    // Navigation
    tint: primaryColors.primaryLight, // Orange-300 - brighter for dark bg
    icon: '#CBD5E1', // Slate-300 - brighter icons
    tabIconDefault: '#64748B', // Slate-500
    tabIconSelected: primaryColors.primaryLight // Orange-300
  }
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace'
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace'
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
  }
})
