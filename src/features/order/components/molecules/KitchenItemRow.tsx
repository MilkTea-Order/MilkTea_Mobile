import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { OrderDetail } from '../../types/order.type'

interface KitchenItemRowProps {
  item: OrderDetail
  isChecked: boolean
  onToggleCheck: (item: OrderDetail) => void
  canCheck: boolean
  colors: {
    text: string
    textSecondary: string
    primary: string
    border: string
    card: string
  }
}

export function KitchenItemRow({ item, isChecked, onToggleCheck, canCheck, colors }: KitchenItemRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={canCheck ? 0.7 : 1}
      onPress={() => canCheck && onToggleCheck(item)}
      className={`flex-row items-center py-3 px-3 rounded-xl border mb-2 ${isChecked ? 'bg-opacity-10' : ''}`}
      style={{
        backgroundColor: isChecked ? `${colors.primary}15` : colors.card,
        borderColor: isChecked ? colors.primary : colors.border
      }}
    >
      <View
        className='w-6 h-6 rounded-lg items-center justify-center mr-3'
        style={{
          backgroundColor: isChecked ? colors.primary : 'transparent',
          borderWidth: 2,
          borderColor: isChecked ? colors.primary : colors.border
        }}
      >
        {isChecked && <Ionicons name='checkmark' size={14} color='white' />}
      </View>

      <View className='flex-1'>
        <View className='flex-row items-center flex-wrap'>
          <Text
            className='text-base font-semibold mr-2'
            style={{ color: isChecked ? colors.textSecondary : colors.text }}
          >
            {item.menu.name}
          </Text>
          {item.size?.name && (
            <View className='px-2 py-1 rounded-md' style={{ backgroundColor: '#374151' }}>
              <Text className='text-xs font-medium text-white'>Size: {item.size.name}</Text>
            </View>
          )}
        </View>

        <View className='flex-row items-center mt-2'>
          <View className='px-3 py-1.5 rounded-lg' style={{ backgroundColor: colors.primary }}>
            <Text className='text-sm font-bold text-white'>Số lượng: {item.quantity}</Text>
          </View>
        </View>

        {item.note && (
          <View
            className='flex-row items-center mt-2 px-2 py-1.5 rounded-md self-start'
            style={{ backgroundColor: `${colors.textSecondary}15` }}
          >
            <Ionicons name='chatbox-ellipses-outline' size={12} color={colors.textSecondary} />
            <Text className='text-xs ml-1.5' style={{ color: colors.textSecondary }}>
              {item.note}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
