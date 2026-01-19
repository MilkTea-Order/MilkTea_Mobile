import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/shared/hooks/useTheme'

export function ThemeSelector() {
  const { colors, themeMode, setThemeMode } = useTheme()

  const options = [
    {
      mode: 'light' as const,
      label: 'Sáng',
      icon: 'sunny'
    },
    {
      mode: 'dark' as const,
      label: 'Tối',
      icon: 'moon'
    },
    {
      mode: 'system' as const,
      label: 'Hệ thống',
      icon: 'phone-portrait'
    }
  ]

  return (
    <View
      className='rounded-2xl p-1'
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <View className='flex-row'>
        {options.map((option, index) => {
          const isSelected = themeMode === option.mode
          return (
            <TouchableOpacity
              key={option.mode}
              onPress={() => setThemeMode(option.mode)}
              className='flex-1 rounded-xl py-3 items-center'
              style={{
                backgroundColor: isSelected ? colors.primary : 'transparent',
                marginHorizontal: index === 1 ? 4 : 0
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={`${option.icon}-outline` as any}
                size={20}
                color={isSelected ? 'white' : colors.textSecondary}
              />
              <Text
                className='text-xs mt-1 font-semibold'
                style={{
                  color: isSelected ? 'white' : colors.textSecondary
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
