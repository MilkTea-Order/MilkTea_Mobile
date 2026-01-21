import { OPTIONS_THEME } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export function ThemeSelector() {
  const { colors, themeMode, setThemeMode } = useTheme()
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
        {OPTIONS_THEME.map((option, index) => {
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
