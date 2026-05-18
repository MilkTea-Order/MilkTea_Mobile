import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { OrderDetail } from '../../types/order.type'

interface KitchenItemRowProps {
  item: OrderDetail
  isChecked: boolean
  onToggleCheck: (item: OrderDetail) => void
  canCheck: boolean
  showCheckbox?: boolean
  colors: {
    text: string
    textSecondary: string
    primary: string
    border: string
    card: string
  }
}

export function KitchenItemRow({
  item,
  isChecked,
  onToggleCheck,
  canCheck,
  showCheckbox = true,
  colors
}: KitchenItemRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={canCheck ? 0.7 : 1}
      onPress={() => canCheck && onToggleCheck(item)}
      className={`relative mb-1.5 flex-row items-center rounded-lg border px-3 py-2 ${isChecked ? 'bg-opacity-10' : ''}`}
      style={{
        backgroundColor: isChecked ? `${colors.primary}18` : colors.card,
        borderColor: isChecked ? colors.primary : colors.border
      }}
    >
      {showCheckbox && (
        <View
          className='mr-2.5 h-5 w-5 items-center justify-center rounded-md'
          style={{
            backgroundColor: isChecked ? colors.primary : 'transparent',
            borderWidth: 1.5,
            borderColor: isChecked ? colors.primary : colors.border
          }}
        >
          {isChecked && <Ionicons name='checkmark' size={11} color='white' />}
        </View>
      )}

      <View className='flex-1'>
        <View className='flex-row items-center justify-between'>
          <Text
            className='mr-2 flex-1 text-sm font-semibold'
            style={{ color: isChecked ? colors.textSecondary : colors.text }}
            numberOfLines={1}
          >
            {item.menu.name}
          </Text>

          <View className='flex-row items-center'>
            {item.size?.name && (
              <View className='mr-1.5 rounded px-1.5 py-0.5' style={{ backgroundColor: '#374151' }}>
                <Text className='text-[10px] font-medium text-white'>{item.size.name}</Text>
              </View>
            )}
            <View className='rounded-md px-2 py-0.5' style={{ backgroundColor: colors.primary }}>
              <Text className='text-xs font-bold text-white'>x{item.quantity}</Text>
            </View>
          </View>
        </View>

        {item.note && (
          <View className='mt-1.5 flex-row items-center'>
            <Ionicons name='chatbox-ellipses-outline' size={10} color={colors.textSecondary} />
            <Text className='ml-1 text-[10px]' style={{ color: colors.textSecondary }} numberOfLines={1}>
              {item.note}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
