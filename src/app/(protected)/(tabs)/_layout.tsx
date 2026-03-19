import { useMe } from '@/features/user/hooks/useUser'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { data: meData } = useMe()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
          height: 60 + (insets.bottom || 8)
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Quản lý',
          tabBarIcon: ({ color, size }) => <Ionicons name='home' size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name='report'
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color, size }) => <Ionicons name='search-circle-outline' size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ focused, size }) => {
            const avatar = meData?.data?.avatar

            return (
              <View
                style={{
                  padding: 2,
                  borderRadius: 999,
                  borderWidth: focused ? 2 : 0,
                  borderColor: colors.primary
                }}
              >
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: size / 2
                    }}
                  />
                ) : (
                  <Ionicons name='person' size={size} color={colors.textSecondary} />
                )}
              </View>
            )
          }
        }}
      />
    </Tabs>
  )
}
