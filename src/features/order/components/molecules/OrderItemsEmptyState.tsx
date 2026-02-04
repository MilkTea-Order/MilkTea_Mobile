import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

interface OrderItemsEmptyStateProps {
  colors: {
    textSecondary: string
  }
}

export function OrderItemsEmptyState({ colors }: OrderItemsEmptyStateProps) {
  return (
    <View className='py-8 items-center'>
      <Ionicons name='restaurant-outline' size={48} color={colors.textSecondary} />
      <Text className='text-base mt-3' style={{ color: colors.textSecondary }}>
        Chưa có món nào trong đơn
      </Text>
    </View>
  )
}
