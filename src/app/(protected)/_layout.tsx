import { useTheme } from '@/shared/hooks/useTheme'
import { Stack } from 'expo-router'
import React from 'react'

export default function ProtectedLayout() {
  const { colors } = useTheme()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background
        }
      }}
    >
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='order'
        options={{
          headerShown: false,
          gestureEnabled: false,
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  )
}
