import { CustomToast } from '@/components/molecules/CustomToast'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { THEME_VARIANT } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import TanstackQueryProvider from '@/shared/providers/Providers'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { ToastProvider } from 'react-native-toast-notifications'

import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../../global.css'

export const unstable_settings = {
  anchor: '(protected)'
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { effectiveTheme } = useTheme()
  const isHydrating = useAuthStore((state) => state.isHydrating)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hideAsync()
    }
  }, [isHydrating])

  return (
    <SafeAreaProvider>
      <ToastProvider
        placement='top'
        offsetTop={50}
        offsetBottom={0}
        animationType='slide-in'
        animationDuration={250}
        duration={3000}
        swipeEnabled={true}
        renderToast={(toastOptions) => <CustomToast message={toastOptions.message} type={toastOptions.type as any} />}
      >
        <TanstackQueryProvider>
          <ThemeProvider value={effectiveTheme === THEME_VARIANT.DARK ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name='(protected)' options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen
                  name='login'
                  // gestureEnabled: false : để tắt vuốt back khi vào trang login
                  options={{ headerShown: false, gestureEnabled: false }}
                />
              </Stack.Protected>
            </Stack>
            {/* Dark -> light, light -> dark */}
            <StatusBar style={effectiveTheme === THEME_VARIANT.DARK ? 'light' : 'dark'} />
          </ThemeProvider>
        </TanstackQueryProvider>
      </ToastProvider>
    </SafeAreaProvider>
  )
}
