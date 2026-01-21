import { Header } from '@/components/layouts/Header'
import { useOrderDetail } from '@/features/order/hooks/useOrder'
import { ORDER_STATUS_LABEL, type OrderStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

export default function OrderDetailScreen() {
  const { colors, status, effectiveTheme } = useTheme()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const orderIdNumber = orderId ? parseInt(orderId, 10) : null
  const { order, isLoading } = useOrderDetail(orderIdNumber, false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='text-base mt-4' style={{ color: colors.textSecondary }}>
          Đang tải chi tiết đơn hàng...
        </Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Chi tiết đơn hàng' />
        <View className='flex-1 items-center justify-center p-6'>
          <Ionicons name='alert-circle-outline' size={64} color={colors.textSecondary} />
          <Text className='text-lg font-semibold mt-4 text-center' style={{ color: colors.textSecondary }}>
            Không tìm thấy đơn hàng
          </Text>
        </View>
      </View>
    )
  }

  const orderStatus = String(order.statusID) as OrderStatus
  const statusColor = status[orderStatus][effectiveTheme]
  const tableLabel = order.dinnerTable?.name ?? (order.dinnerTableID ? `Bàn ${order.dinnerTableID}` : 'Mang đi')
  const statusName = order.status?.name ?? ORDER_STATUS_LABEL[orderStatus]

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header title='Chi tiết đơn hàng' subtitle={tableLabel} />

      {/* Content */}
      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Order Info */}
        <View
          className='rounded-3xl p-6 mb-5 border-2'
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3
          }}
        >
          <View className='flex-row items-center justify-between mb-5'>
            <View className='flex-row items-center flex-1'>
              <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}15` }}>
                <Ionicons name='information-circle-outline' size={24} color={colors.primary} />
              </View>
              <Text className='text-xl font-bold' style={{ color: colors.text }}>
                Thông tin đơn hàng
              </Text>
            </View>
            <View
              className='rounded-full px-3 py-1.5 border'
              style={{
                backgroundColor: statusColor.bg,
                borderColor: statusColor.border
              }}
            >
              <Text className='text-sm font-bold' style={{ color: statusColor.text }}>
                {statusName}
              </Text>
            </View>
          </View>
          <View style={{ gap: 16 }}>
            <View className='flex-row items-center justify-between py-2'>
              <View className='flex-row items-center flex-1'>
                <Ionicons name='restaurant-outline' size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  Số bàn
                </Text>
              </View>
              <Text className='text-base font-bold' style={{ color: colors.text }}>
                {tableLabel}
              </Text>
            </View>
            <View className='flex-row items-center justify-between py-2'>
              <View className='flex-row items-center flex-1'>
                <Ionicons name='time-outline' size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  Thời gian đặt
                </Text>
              </View>
              <Text className='text-base font-bold' style={{ color: colors.text }}>
                {formatDateTime(order.orderDate)}
              </Text>
            </View>
            <View className='flex-row items-center justify-between py-2'>
              <View className='flex-row items-center flex-1'>
                <Ionicons name='calendar-outline' size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  Ngày tạo
                </Text>
              </View>
              <Text className='text-base font-bold' style={{ color: colors.text }}>
                {formatDateTime(order.createdDate)}
              </Text>
            </View>
            {order.note && (
              <View className='mt-2 pt-4' style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                <View className='flex-row items-center mb-3'>
                  <Ionicons
                    name='document-text-outline'
                    size={18}
                    color={colors.textSecondary}
                    style={{ marginRight: 8 }}
                  />
                  <Text className='text-sm font-semibold' style={{ color: colors.textSecondary }}>
                    Ghi chú
                  </Text>
                </View>
                <Text className='text-base leading-6' style={{ color: colors.text }}>
                  {order.note}
                </Text>
              </View>
            )}
            {/* Total Price */}
            <View className='mt-4 pt-4' style={{ borderTopWidth: 2, borderTopColor: colors.border }}>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                  <Ionicons name='cash-outline' size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text className='text-base font-bold' style={{ color: colors.text }}>
                    Tổng cộng
                  </Text>
                </View>
                <Text className='text-2xl font-bold' style={{ color: colors.primary }}>
                  {formatCurrency(order.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View
          className='rounded-3xl p-6 mb-5 border-2'
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3
          }}
        >
          <View className='flex-row items-center mb-5'>
            <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}15` }}>
              <Ionicons name='list-outline' size={24} color={colors.primary} />
            </View>
            <Text className='text-xl font-bold' style={{ color: colors.text }}>
              Danh sách món ({order.orderDetails.length})
            </Text>
          </View>
          {order.orderDetails.length === 0 ? (
            <View className='py-8 items-center'>
              <Ionicons name='restaurant-outline' size={48} color={colors.textSecondary} />
              <Text className='text-base mt-3' style={{ color: colors.textSecondary }}>
                Chưa có món nào trong đơn
              </Text>
            </View>
          ) : (
            order.orderDetails.map((item, index) => (
              <View
                key={item.id}
                className='flex-row items-start justify-between py-4'
                style={{
                  borderBottomWidth: index !== order.orderDetails.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border
                }}
              >
                <View className='flex-1 mr-4'>
                  <View className='flex-row items-center mb-2'>
                    <Text className='text-base font-bold flex-1' style={{ color: colors.text }}>
                      {item.menu?.name ?? `Món #${item.menuID}`}
                    </Text>
                    {item.menu?.unitName && (
                      <Text
                        className='text-xs px-2 py-1 rounded ml-2'
                        style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                      >
                        {item.menu.unitName}
                      </Text>
                    )}
                  </View>
                  <View className='flex-row items-center flex-wrap mb-2' style={{ gap: 8 }}>
                    <View className='flex-row items-center'>
                      <Text className='text-sm' style={{ color: colors.textSecondary }}>
                        {formatCurrency(item.price)}
                      </Text>
                      <Text className='text-sm mx-2' style={{ color: colors.textSecondary }}>
                        ×
                      </Text>
                      <Text className='text-sm font-semibold' style={{ color: colors.textSecondary }}>
                        {item.quantity}
                      </Text>
                    </View>
                    {item.size?.name && (
                      <View className='px-2 py-1 rounded' style={{ backgroundColor: colors.border }}>
                        <Text className='text-xs font-semibold' style={{ color: colors.textSecondary }}>
                          Size: {item.size.name}
                        </Text>
                      </View>
                    )}
                  </View>
                  {item.note && (
                    <View className='mt-1 flex-row items-start'>
                      <Ionicons
                        name='document-text-outline'
                        size={12}
                        color={colors.textSecondary}
                        style={{ marginRight: 4, marginTop: 2 }}
                      />
                      <Text className='text-xs flex-1 italic leading-4' style={{ color: colors.textSecondary }}>
                        {item.note}
                      </Text>
                    </View>
                  )}
                </View>
                <View className='items-end'>
                  <Text className='text-lg font-bold mb-1' style={{ color: colors.primary }}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}
