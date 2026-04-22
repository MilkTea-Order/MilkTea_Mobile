import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export interface ProfileMenuItemProps {
  icon: string
  label: string
  onPress?: () => void
  showBorder?: boolean
}

export function ProfileMenuItem({ icon, label, onPress, showBorder = true }: ProfileMenuItemProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      className='flex-row items-center px-4 py-4'
      style={{
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: colors.border
      }}
      activeOpacity={0.7}
    >
      <View
        className='rounded-xl p-3 mr-4'
        style={{
          backgroundColor: `${colors.primary}12`
        }}
      >
        <Ionicons name={icon as any} size={24} color={colors.primary} />
      </View>
      <Text className='flex-1 font-medium' style={{ color: colors.text }}>
        {label}
      </Text>
      <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  )
}
