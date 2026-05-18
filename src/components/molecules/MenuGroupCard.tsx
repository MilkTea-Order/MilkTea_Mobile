import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

type Props = {
  name: string
  quantity: number
  onPress: () => void
  colors: {
    card: string
    border: string
    text: string
    textSecondary: string
    primary: string
  }
}

export const MenuGroupCard: React.FC<Props> = ({ name, quantity, onPress, colors }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='rounded-3xl border-2 p-5'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
      }}
      activeOpacity={0.85}
    >
      <View className='mb-3 self-start rounded-2xl p-3' style={{ backgroundColor: `${colors.primary}20` }}>
        <Ionicons name='grid-outline' size={24} color={colors.primary} />
      </View>
      <Text className='mb-1 text-lg font-bold' style={{ color: colors.text }}>
        {name}
      </Text>
      <Text className='text-sm' style={{ color: colors.textSecondary }}>
        {quantity} món
      </Text>
    </TouchableOpacity>
  )
}
