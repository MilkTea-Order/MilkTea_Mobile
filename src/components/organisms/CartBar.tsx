import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

type CartItem = {
  menuId: number
  menuName: string
  sizeId: number
  sizeName: string
  price: number
  quantity: number
}

type Props = {
  items: CartItem[]
  colors: {
    card: string
    border: string
    text: string
    primary: string
  }
  totalLabel: string
  totalValue: string
  onAdd: (menuId: number, sizeId: number) => void
  onRemove: (menuId: number, sizeId: number) => void
  onSubmit: () => Promise<void> | void
  isSubmitting?: boolean
}

export const CartBar: React.FC<Props> = ({
  items,
  colors,
  totalLabel,
  totalValue,
  onAdd,
  onRemove,
  onSubmit,
  isSubmitting
}) => {
  const disabled = items.length === 0 || !!isSubmitting

  return (
    <View
      className='border-t-2 px-5 py-4'
      style={{
        backgroundColor: colors.card,
        borderTopColor: colors.border
      }}
    >
      <View className='flex-row items-center justify-between mb-3'>
        <View className='flex-row items-center'>
          <Ionicons name='cart-outline' size={24} color={colors.primary} />
          <Text className='text-lg font-bold ml-2' style={{ color: colors.text }}>
            {totalLabel}
          </Text>
        </View>
        <Text className='text-xl font-bold' style={{ color: colors.primary }}>
          {totalValue}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-3'>
        {items.map((item) => (
          <View
            key={`${item.menuId}-${item.sizeId}`}
            className='rounded-xl px-3 py-2 mr-2 flex-row items-center'
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <View className='mr-2'>
              <Text className='text-sm font-semibold' style={{ color: colors.text }}>
                {item.menuName}
              </Text>
              <Text className='text-xs' style={{ color: colors.primary }}>
                {item.sizeName}
              </Text>
            </View>
            <View className='flex-row items-center'>
              <TouchableOpacity
                onPress={() => onRemove(item.menuId, item.sizeId)}
                className='rounded-full p-1'
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name='remove' size={12} color='white' />
              </TouchableOpacity>
              <Text className='text-sm font-bold mx-2' style={{ color: colors.primary }}>
                {item.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => onAdd(item.menuId, item.sizeId)}
                className='rounded-full p-1'
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name='add' size={12} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        className='rounded-2xl py-4'
        style={{
          backgroundColor: disabled ? `${colors.primary}60` : colors.primary,
          opacity: disabled ? 0.8 : 1
        }}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onSubmit}
      >
        <Text className='text-white text-center text-lg font-bold'>
          {isSubmitting ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
