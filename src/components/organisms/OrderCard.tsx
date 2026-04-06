import type { Order } from '@/features/order/types/order.type'
import { STATUS } from '@/shared/constants/status'
import type { ThemeVariant } from '@/shared/constants/theme'
import { statusColors } from '@/shared/constants/theme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDate } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

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
  const imgTable = order.dinnerTable.usingImg
  const date =
    order.status.id === parseInt(STATUS.ORDER.UNPAID, 10)
      ? order.orderDate
      : order.status.id === parseInt(STATUS.ORDER.NO_COLLECTED, 10)
        ? order.paymentDate
        : order.status.id === parseInt(STATUS.ORDER.PAID, 10)
          ? order.actionDate
          : order.cancelledDate
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
        {imgTable ? (
          <Image source={{ uri: imgTable }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
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
            {formatDate(date ? dayjs(date) : null, 'HH:mm DD/MM/YYYY')}
            {/* {order.orderID} */}
          </Text>
        </View>

        {/* Total Amount */}
        <Text className='text-sm font-bold mb-2' style={{ color: colors.primary }} numberOfLines={1}>
          {formatCurrencyVND(order?.totalAmount ?? 0)}
        </Text>

        {/* Action Buttons - Icon */}
        <View className='flex-row items-center justify-between gap-3 mt-2'>
          {onPressPayment && order.status.id === parseInt(STATUS.ORDER.UNPAID, 10) && (
            <TouchableOpacity
              onPress={onPressPayment}
              className='rounded-full p-2'
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
              <Ionicons name='card-outline' size={16} color='white' />
            </TouchableOpacity>
          )}
          {onPressTransferTable && order.status.id === parseInt(STATUS.ORDER.UNPAID, 10) && (
            <TouchableOpacity
              onPress={onPressTransferTable}
              className='rounded-full p-2'
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderWidth: 1.5,
                borderColor: 'rgba(59, 130, 246, 0.5)'
              }}
              activeOpacity={0.7}
            >
              <Ionicons name='swap-horizontal-outline' size={16} color='#3b82f6' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
