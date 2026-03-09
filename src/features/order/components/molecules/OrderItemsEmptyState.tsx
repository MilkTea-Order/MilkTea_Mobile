import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

interface OrderItemsEmptyStateProps {
  colors: {
    textSecondary: string
  }
  filterMode: 'placed' | 'cancelled'
}

export function OrderItemsEmptyState({ colors, filterMode }: OrderItemsEmptyStateProps) {
  return (
    <View className='py-8 items-center'>
      <Ionicons name='restaurant-outline' size={48} color={colors.textSecondary} />
      <Text className='text-base mt-3' style={{ color: colors.textSecondary }}>
        {filterMode === 'placed' ? 'Chưa có món nào được đặt' : ' Không có món nào bị huỷ'}
      </Text>
    </View>
  )
}
