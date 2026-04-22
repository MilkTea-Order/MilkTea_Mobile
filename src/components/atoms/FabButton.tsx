import { ColorTheme } from '@/shared/constants/theme'
import { Ionicons } from '@expo/vector-icons'

import React from 'react'
import { TouchableOpacity } from 'react-native'

interface FabButtonProps {
  colors: ColorTheme
  onPress: () => void
}

export function FabButton({ colors, onPress }: FabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='rounded-full p-7'
      style={{
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8
      }}
    >
      <Ionicons name='add' size={28} color='white' />
    </TouchableOpacity>
  )
}
