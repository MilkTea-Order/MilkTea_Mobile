import type { Order } from '@/features/order/types/order.type'
import { STATUS } from '@/shared/constants/status'
import type { ThemeVariant } from '@/shared/constants/theme'
import { statusColors } from '@/shared/constants/theme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDateTime } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  order: Order
  colors: any
  statusColors: typeof statusColors
  effectiveTheme: ThemeVariant
  onPressDetail: () => void
  onPressPayment?: () => void
  onPressTransferTable?: () => void
}

export const OrderCard = ({
  order,
  colors,
  statusColors,
  effectiveTheme,
  onPressDetail,
  onPressPayment,
  onPressTransferTable
}: Props) => {
  return (
    <TouchableOpacity
      className='rounded-2xl overflow-hidden'
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
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
          height: 65,
          backgroundColor: `${colors.primary}10`
        }}
        className='relative'
      >
        {order.dinnerTable?.usingImg ? (
          <Image
            source={{ uri: order.dinnerTable.usingImg }}
            style={{ width: '100%', height: '100%' }}
            resizeMode='contain'
          />
        ) : (
          <View className='w-full h-full items-center justify-center bg-gray-50'>
            <Ionicons name='restaurant-outline' size={24} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className='p-2.5'>
        {/* Time */}
        <View className='flex-row items-center mb-1.5'>
          <Ionicons name='time-outline' size={10} color={colors.textSecondary} style={{ marginRight: 3 }} />
          <Text className='text-[9px]' style={{ color: colors.textSecondary }} numberOfLines={1}>
            {formatDateTime(order.orderDate)}
          </Text>
        </View>

        {/* Total Amount */}
        <Text className='text-sm font-bold mb-2' style={{ color: colors.primary }} numberOfLines={1}>
          {formatCurrencyVND(order?.totalAmount ?? 0)}
        </Text>

        {/* Action Buttons - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 6, paddingRight: 4 }}
        >
          {onPressPayment && order.status.id === parseInt(STATUS.ORDER.UNPAID, 10) && (
            <TouchableOpacity
              onPress={onPressPayment}
              className='flex-row items-center rounded-full px-3 py-1.5'
              style={{
                backgroundColor: colors.primary,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2
              }}
              activeOpacity={0.7}
            >
              <Ionicons name='card-outline' size={12} color='white' />
              <Text className='text-[8px] font-bold ml-1.5' style={{ color: 'white' }}>
                Thanh toán
              </Text>
            </TouchableOpacity>
          )}
          {onPressTransferTable && order.status.id === parseInt(STATUS.ORDER.UNPAID, 10) && (
            <TouchableOpacity
              onPress={onPressTransferTable}
              className='flex-row items-center rounded-full px-3 py-1.5'
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderWidth: 1.5,
                borderColor: 'rgba(59, 130, 246, 0.5)'
              }}
              activeOpacity={0.7}
            >
              <Ionicons name='swap-horizontal-outline' size={12} color='#3b82f6' />
              <Text className='text-[8px] font-bold ml-1.5' style={{ color: '#3b82f6' }}>
                Chuyển bàn
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </TouchableOpacity>
  )
}
