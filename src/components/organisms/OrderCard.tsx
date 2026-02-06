import type { Order } from '@/features/order/types/order.type'
import { type OrderStatus } from '@/shared/constants/status'
import type { ThemeVariant } from '@/shared/constants/theme'
import { statusColors } from '@/shared/constants/theme'
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
  const orderStatus = String(order.statusID) as OrderStatus
  const statusColor = statusColors[orderStatus][effectiveTheme]

  const formatCurrency = (amount?: number | null) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0)

  const getTableLabel = () =>
    order.dinnerTable?.name ?? (order.dinnerTableID ? `Bàn ${order.dinnerTableID}` : 'Mang đi')

  return (
    <TouchableOpacity
      className='rounded-3xl p-4 border-2'
      style={{
        backgroundColor: colors.card,
        borderColor: statusColor.border,
        shadowColor: statusColor.border,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4
      }}
      activeOpacity={0.8}
      onPress={onPressDetail}
    >
      {/* Header */}
      <View className='mb-3'>
        <View className='flex-row items-center' style={{ gap: 12 }}>
          {/* Table Image */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: `${colors.primary}10`
            }}
          >
            {order.dinnerTable?.usingImg ? (
              <Image
                source={{ uri: order.dinnerTable.usingImg }}
                style={{ width: '100%', height: '100%' }}
                resizeMode='contain'
              />
            ) : (
              <View className='flex-1 items-center justify-center'>
                <Ionicons name='restaurant-outline' size={28} color={colors.primary} />
              </View>
            )}
          </View>

          {/* Meta info */}
          <View className='flex-1'>
            <View className='flex-row items-center'>
              <Ionicons name='time-outline' size={11} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
                {formatDateTime(order.orderDate)}
              </Text>
            </View>
            <View
              className='mt-1 rounded-full px-3 py-1'
              style={{
                alignSelf: 'flex-start',
                backgroundColor: `${colors.primary}10`
              }}
            >
              <Text className='text-xs font-semibold' style={{ color: colors.primary }} numberOfLines={1}>
                {getTableLabel()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View
        className='mb-3'
        style={{
          height: 1,
          backgroundColor: colors.border,
          opacity: 0.5
        }}
      />

      {/* Footer */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-1'>
          <Text className='text-base font-bold' style={{ color: colors.primary }}>
            {formatCurrency(order?.totalAmount ?? 0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
