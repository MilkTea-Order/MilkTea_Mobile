import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

interface OrderNotFoundStateProps {
  colors: {
    background: string
    textSecondary: string
  }
}

export function OrderNotFoundState({ colors }: OrderNotFoundStateProps) {
  return (
    <View className='flex-1 items-center justify-center p-6'>
      <Ionicons name='alert-circle-outline' size={64} color={colors.textSecondary} />
      <Text className='text-lg font-semibold mt-4 text-center' style={{ color: colors.textSecondary }}>
        Không tìm thấy đơn hàng
      </Text>
    </View>
  )
}
