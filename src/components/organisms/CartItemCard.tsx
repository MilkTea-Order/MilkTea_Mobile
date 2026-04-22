import { useTheme } from '@/shared/hooks/useTheme'
import { OrderItem } from '@/features/order/types/order.type'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export interface CartItemCardProps {
  item: OrderItem
  onIncrement?: (menuId: number, sizeId: number) => void
  onDecrement?: (menuId: number, sizeId: number) => void
  onEdit?: (menuId: number, sizeId: number) => void
  onRemove?: (menuId: number, sizeId: number) => void
  error?: string
}

export function CartItemCard({ item, onIncrement, onDecrement, onEdit, onRemove, error }: CartItemCardProps) {
  const { colors } = useTheme()

  const handleDecrement = () => {
    if (item.quantity === 1) {
      onRemove?.(item.menuId, item.sizeId)
    } else {
      onDecrement?.(item.menuId, item.sizeId)
    }
  }

  return (
    <View
      className='rounded-2xl p-3 mb-3 border'
      style={{
        backgroundColor: colors.card,
        borderColor: error ? colors.error : colors.border,
        borderWidth: error ? 2 : 1
      }}
    >
      <View className='flex-row items-center justify-between'>
        <View
          className='rounded-xl mr-3 overflow-hidden items-center justify-center'
          style={{ width: 52, height: 52, backgroundColor: `${colors.primary}10` }}
        >
          {item.menuImage ? (
            <Image source={{ uri: item.menuImage }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
          ) : (
            <Ionicons name='restaurant-outline' size={28} color={colors.primary} />
          )}
        </View>

        <View className='flex-1 mr-3'>
          <View className='flex-row items-center mt-2'>
            <Text className='text-lg font-bold mr-2' style={{ color: colors.text }} numberOfLines={2}>
              {item.menuName}
            </Text>
            <View className='px-2 py-1 rounded' style={{ backgroundColor: `${colors.primary}15` }}>
              <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                {item.sizeName}
              </Text>
            </View>
          </View>

          {item.note ? (
            <View className='mt-1 flex-row items-start' style={{ gap: 6 }}>
              <Ionicons name='chatbubble-ellipses-outline' size={14} color={colors.textSecondary} />
              <Text className='flex-1 text-xs' style={{ color: colors.textSecondary }} numberOfLines={2}>
                {item.note}
              </Text>
            </View>
          ) : null}

          <View className='flex-row items-center mt-1'>
            <TouchableOpacity onPress={() => onEdit?.(item.menuId, item.sizeId)} activeOpacity={0.8}>
              <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                Chỉnh sửa
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className='mt-1 flex-row items-center'>
              <Ionicons name='alert-circle' size={14} color={colors.error} />
              <Text className='ml-1.5 text-xs' style={{ color: colors.error }}>
                {error}
              </Text>
            </View>
          ) : null}
        </View>

        <View className='items-end'>
          <Text className='text-sm font-bold' style={{ color: colors.textSecondary }}>
            {formatCurrencyVND(item.price * item.quantity)}
          </Text>

          <View
            className='flex-row items-center rounded-full mt-2'
            style={{
              borderWidth: 1.5,
              borderColor: colors.primary,
              paddingHorizontal: 6,
              paddingVertical: 4
            }}
          >
            <TouchableOpacity
              onPress={handleDecrement}
              className='rounded-full'
              style={{
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              activeOpacity={0.8}
            >
              <Ionicons name='remove' size={16} color={colors.primary} />
            </TouchableOpacity>

            <Text className='text-sm font-bold min-w-[24px] text-center' style={{ color: colors.text }}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => onIncrement?.(item.menuId, item.sizeId)}
              className='rounded-full'
              style={{
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              activeOpacity={0.8}
            >
              <Ionicons name='add' size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
