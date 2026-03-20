import { useTheme } from '@/shared/hooks/useTheme'
import { Stack } from 'expo-router'
import React from 'react'

export default function ReportStackLayout() {
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
        name='inventory-report'
        options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name='revenue-report'
        options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  )
}
