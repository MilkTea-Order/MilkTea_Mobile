import { useTheme } from '@/shared/hooks/useTheme'
import { Stack } from 'expo-router'
import React from 'react'

export default function ProfileStackLayout() {
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
      <Stack.Screen name='index' />
      <Stack.Screen
        name='change-password'
        options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name='edit-profile'
        options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  )
}
