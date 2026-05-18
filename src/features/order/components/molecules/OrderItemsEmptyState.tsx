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
    <View className='items-center py-8'>
      <Ionicons name='restaurant-outline' size={48} color={colors.textSecondary} />
      <Text className='mt-3 text-base' style={{ color: colors.textSecondary }}>
        {filterMode === 'placed' ? 'Chưa có món nào được đặt' : ' Không có món nào bị huỷ'}
      </Text>
    </View>
  )
}
