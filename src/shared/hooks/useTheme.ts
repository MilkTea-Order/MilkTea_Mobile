import { useColorScheme } from 'react-native'
import { Colors, gradientColors, statusColors, THEME_MODE, THEME_VARIANT, type ThemeVariant } from '../constants/theme'
import { useThemeStore } from '../store/themeStore'

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore()
  const systemColorScheme = useColorScheme()
  // Theo hệ thống thì check useColorScheme nhưng nếu null thì mặc định là light còn không theo hệ thống thì cứ dựa theo theme color hiện tại light hay dark mà hiển thị
  const effectiveTheme: ThemeVariant =
    themeMode === THEME_MODE.SYSTEM
      ? systemColorScheme === THEME_VARIANT.DARK
        ? THEME_VARIANT.DARK
        : THEME_VARIANT.LIGHT
      : (themeMode as ThemeVariant)

  const isDark = effectiveTheme === THEME_VARIANT.DARK
  const colors = Colors[effectiveTheme]
  const gradients = gradientColors[effectiveTheme]
  const status = statusColors

  return {
    themeMode,
    effectiveTheme,
    setThemeMode,
    isDark,
    colors,
    gradients,
    status
  }
}
