import { CustomToast } from '@/components/molecules/CustomToast'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { THEME_VARIANT } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import TanstackQueryProvider from '@/shared/providers/Providers'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { ToastProvider } from 'react-native-toast-notifications'

export const unstable_settings = {
  anchor: '(protected)'
}
export default function AppProvider() {
  const { effectiveTheme } = useTheme()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  return (
    <ToastProvider
      placement='top'
      offsetTop={50}
      animationType='slide-in'
      renderToast={(t) => <CustomToast message={t.message} type={t.type as any} />}
    >
      <TanstackQueryProvider>
        <ThemeProvider value={effectiveTheme === THEME_VARIANT.DARK ? DarkTheme : DefaultTheme}>
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name='(protected)' />
              </Stack.Protected>
              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name='login' options={{ gestureEnabled: false }} />
              </Stack.Protected>
            </Stack>
            <StatusBar style={effectiveTheme === THEME_VARIANT.DARK ? 'light' : 'dark'} />
          </KeyboardProvider>
        </ThemeProvider>
      </TanstackQueryProvider>
    </ToastProvider>
  )
}
