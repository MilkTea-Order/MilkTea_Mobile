import type { Order } from '@/features/order/types/order.type'
import { type OrderStatus } from '@/shared/constants/status'
import type { ThemeVariant } from '@/shared/constants/theme'
import { statusColors } from '@/shared/constants/theme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDateTime } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  order: Order
  colors: any
  statusColors: typeof statusColors
  effectiveTheme: ThemeVariant
  onPressDetail: () => void
}
export const OrderCard = ({ order, colors, statusColors, effectiveTheme, onPressDetail }: Props) => {
  const orderStatus = String(order.status.id) as OrderStatus
  const statusColor = statusColors[orderStatus][effectiveTheme]

  return (
    <TouchableOpacity
      className='rounded-2xl overflow-hidden border'
      style={{
        backgroundColor: colors.card,
        borderColor: statusColor.border,
        shadowColor: statusColor.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
      }}
      activeOpacity={0.85}
      onPress={onPressDetail}
    >
      {/* Image Section */}
      <View
        style={{
          width: '100%',
          height: 70,
          backgroundColor: `${colors.primary}08`
        }}
        className='overflow-hidden items-center justify-center p-1'
      >
        {order.dinnerTable?.usingImg ? (
          <Image
            source={{ uri: order.dinnerTable.usingImg }}
            style={{ width: '100%', height: '100%' }}
            resizeMode='contain'
          />
        ) : (
          <View className='rounded-full p-2' style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name='restaurant-outline' size={28} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className='p-2.5'>
        {/* Time */}
        <View className='flex-row items-center mb-2'>
          <Ionicons name='time-outline' size={10} color={colors.primary} style={{ marginRight: 4 }} />
          <Text className='text-[9px] font-medium' style={{ color: colors.textSecondary }} numberOfLines={1}>
            {formatDateTime(order.orderDate)}
          </Text>
        </View>

        {/* Total Amount */}
        <View className='flex-row items-center justify-between'>
          <View className='flex-1'>
            {/* <Text className='text-[9px] font-medium mb-0.5' style={{ color: colors.textSecondary }}>
              Tổng tiền
            </Text> */}
            <Text className='text-sm font-bold' style={{ color: colors.primary }} numberOfLines={1}>
              {formatCurrencyVND(order?.totalAmount ?? 0)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
