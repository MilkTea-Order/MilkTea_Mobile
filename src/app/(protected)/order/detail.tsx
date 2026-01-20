import { Header } from '@/components/layouts/Header'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderDetail {
  id: string
  tableNumber: string
  customerName?: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createdAt: string
  note?: string
}

// Mock data - In real app, fetch from API using orderId
const mockOrderDetail: OrderDetail = {
  id: '1',
  tableNumber: 'Bàn 01',
  customerName: 'Nguyễn Văn A',
  items: [
    { name: 'Trà sữa truyền thống', quantity: 2, price: 35000 },
    { name: 'Trà sữa matcha', quantity: 1, price: 45000 },
    { name: 'Bánh flan', quantity: 1, price: 20000 }
  ],
  total: 135000,
  status: 'pending',
  createdAt: '2024-01-15T10:30:00',
  note: 'Ít đá, ít đường'
}

const statusLabels = {
  pending: 'Chờ xử lý',
  preparing: 'Đang pha chế',
  ready: 'Sẵn sàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
}

const statusIcons = {
  pending: 'time-outline',
  preparing: 'cafe-outline',
  ready: 'checkmark-circle-outline',
  completed: 'checkmark-done-circle-outline',
  cancelled: 'close-circle-outline'
}

export default function OrderDetailScreen() {
  const { colors } = useTheme()

  // In real app, fetch order detail using params.id or params.tableId
  const order = mockOrderDetail

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

  const getStatusColor = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF4E6', text: '#FF8C00', border: '#FFB84D', icon: '#FF8C00' }
      case 'preparing':
        return { bg: '#E6F3FF', text: '#0066CC', border: '#4DA6FF', icon: '#0066CC' }
      case 'ready':
        return { bg: '#E6F7E6', text: '#00AA00', border: '#4DD14D', icon: '#00AA00' }
      case 'completed':
        return { bg: '#F0F0F0', text: '#666666', border: '#CCCCCC', icon: '#666666' }
      case 'cancelled':
        return { bg: '#FFE6E6', text: '#CC0000', border: '#FF4D4D', icon: '#CC0000' }
      default:
        return { bg: colors.card, text: colors.text, border: colors.border, icon: colors.primary }
    }
  }

  const statusColor = getStatusColor(order.status)

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header title='Chi tiết đơn hàng' subtitle={order.tableNumber} />

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
              className='rounded-full px-3 py-1.5 flex-row items-center'
              style={{ backgroundColor: statusColor.bg }}
            >
              <Ionicons
                name={statusIcons[order.status] as any}
                size={16}
                color={statusColor.text}
                style={{ marginRight: 6 }}
              />
              <Text className='text-sm font-bold' style={{ color: statusColor.text }}>
                {statusLabels[order.status]}
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
                {order.tableNumber}
              </Text>
            </View>
            {order.customerName && (
              <View className='flex-row items-center justify-between py-2'>
                <View className='flex-row items-center flex-1'>
                  <Ionicons name='person-outline' size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                  <Text className='text-sm' style={{ color: colors.textSecondary }}>
                    Khách hàng
                  </Text>
                </View>
                <Text className='text-base font-bold' style={{ color: colors.text }}>
                  {order.customerName}
                </Text>
              </View>
            )}
            <View className='flex-row items-center justify-between py-2'>
              <View className='flex-row items-center flex-1'>
                <Ionicons name='time-outline' size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  Thời gian
                </Text>
              </View>
              <Text className='text-base font-bold' style={{ color: colors.text }}>
                {formatDateTime(order.createdAt)}
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
                  {formatCurrency(order.total)}
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
              Danh sách món ({order.items.length})
            </Text>
          </View>
          {order.items.map((item, index) => (
            <View
              key={index}
              className='flex-row items-center justify-between py-4'
              style={{
                borderBottomWidth: index !== order.items.length - 1 ? 1 : 0,
                borderBottomColor: colors.border
              }}
            >
              <View className='flex-1 mr-4'>
                <Text className='text-base font-bold mb-2' style={{ color: colors.text }}>
                  {item.name}
                </Text>
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
              </View>
              <Text className='text-lg font-bold' style={{ color: colors.primary }}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <View
          className='border-t-2 px-5 py-4'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border
          }}
        >
          <View className='flex-row gap-3'>
            {order.status === 'pending' && (
              <>
                <TouchableOpacity
                  className='flex-1 rounded-2xl py-4'
                  style={{ backgroundColor: '#FF4D4D' }}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Handle cancel
                  }}
                >
                  <Text className='text-white text-center text-base font-bold'>Hủy đơn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex-1 rounded-2xl py-4'
                  style={{ backgroundColor: colors.primary }}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Handle start preparing
                  }}
                >
                  <Text className='text-white text-center text-base font-bold'>Bắt đầu pha chế</Text>
                </TouchableOpacity>
              </>
            )}
            {order.status === 'preparing' && (
              <TouchableOpacity
                className='flex-1 rounded-2xl py-4'
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={() => {
                  // Handle mark as ready
                }}
              >
                <Text className='text-white text-center text-base font-bold'>Đánh dấu sẵn sàng</Text>
              </TouchableOpacity>
            )}
            {order.status === 'ready' && (
              <TouchableOpacity
                className='flex-1 rounded-2xl py-4'
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={() => {
                  // Handle complete
                }}
              >
                <Text className='text-white text-center text-base font-bold'>Hoàn thành</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
