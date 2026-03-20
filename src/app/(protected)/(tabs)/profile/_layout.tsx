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
    </Stack>
  )
}
