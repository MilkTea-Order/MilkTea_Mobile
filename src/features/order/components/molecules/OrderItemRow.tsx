import { formatCurrency } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { OrderDetail } from '../../types/order.type'

interface OrderItemRowProps {
  item: OrderDetail
  onCancel?: (item: OrderDetail) => void
  onUpdate?: (orderDetailId: number) => void
  isCancelling?: boolean
  canActionButton: boolean
  colors: {
    text: string
    textSecondary: string
    primary: string
    border: string
  }
}

export function OrderItemRow({ item, onCancel, onUpdate, isCancelling, canActionButton, colors }: OrderItemRowProps) {
  return (
    <View className='flex-row items-start justify-between py-4'>
      <View className='mr-4 flex-1'>
        <View className='mb-2 flex-row items-center'>
          <Text className='text-base font-bold' style={{ color: colors.text }}>
            {item.menu.name ?? `Món #${item.menu.id}`}
          </Text>

          {item.size?.name && (
            <View className='ml-2 rounded px-2  py-1' style={{ backgroundColor: colors.border }}>
              <Text className='text-xs font-semibold' style={{ color: colors.textSecondary }}>
                Size: {item.size.name}
              </Text>
            </View>
          )}
        </View>

        <View className='mb-2 flex-row flex-wrap items-center' style={{ gap: 8 }}>
          <View className='flex-row items-center'>
            <Text className='text-sm' style={{ color: colors.textSecondary }}>
              {formatCurrency(item.price)}
            </Text>
            <Text className='mx-2 text-sm' style={{ color: colors.textSecondary }}>
              ×
            </Text>
            <Text className='text-sm font-semibold' style={{ color: colors.textSecondary }}>
              {item.quantity}
            </Text>
          </View>
          {item.menu.unit?.name && (
            <Text
              className='rounded px-2 py-1 text-xs'
              style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
            >
              {item.menu.unit.name}
            </Text>
          )}
        </View>

        {item.note && (
          <View className='mt-1 flex-row items-center'>
            <Ionicons name='document-text-outline' size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text className='flex-1 text-xs italic' style={{ color: colors.textSecondary }}>
              {item.note}
            </Text>
          </View>
        )}
      </View>

      <View className='items-end'>
        <Text className='mb-1 text-lg font-bold' style={{ color: colors.primary }}>
          {formatCurrency(item.price * item.quantity)}
        </Text>

        <View className='flex-row gap-2'>
          {!!onUpdate && !item.cancelledBy && canActionButton && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const id = Number(item.id)
                if (!Number.isFinite(id)) return
                onUpdate(id)
              }}
              className='mt-2 rounded-lg px-3 py-2'
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                Cập nhật
              </Text>
            </TouchableOpacity>
          )}

          {!!onCancel && !item.cancelledBy && canActionButton && (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!!isCancelling}
              onPress={() => onCancel(item)}
              className='mt-2 rounded-lg px-3 py-2'
              style={{ backgroundColor: `${colors.primary}15`, opacity: isCancelling ? 0.6 : 1 }}
            >
              <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                {isCancelling ? 'Đang hủy...' : 'Hủy món'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
