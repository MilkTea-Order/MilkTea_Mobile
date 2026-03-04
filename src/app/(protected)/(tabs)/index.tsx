import { Header } from '@/components/layouts/Header'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { OrderCard } from '@/components/organisms/OrderCard'
import { OrderFilterChips } from '@/components/organisms/OrderFilterChips'
import type { OrderFilter } from '@/features/order/api/order.api'
import { PaymentMethodModal } from '@/features/order/components/organisms/PaymentMethodModal'
import { TransferTableModal } from '@/features/order/components/organisms/TransferTableModal'
import { useChangeTable, useOrders, usePayment } from '@/features/order/hooks/useOrder'
import { Order } from '@/features/order/types/order.type'
import { useMe } from '@/features/user/hooks/useUser'
import { PaymentMethod } from '@/shared/constants/other'
import { ORDER_STATUS_LABEL, STATUS, type OrderStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { colors, status, effectiveTheme } = useTheme()
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>(STATUS.ORDER.UNPAID)
  const [dayAgo, setDayAgo] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentTableId, setCurrentTableId] = useState<number | null>(null)

  const router = useRouter()
  const params = useLocalSearchParams<{ filter?: OrderStatus }>()

  // Tạo filter object cho API
  const orderFilter: OrderFilter = useMemo(
    () => ({
      statusId: selectedFilter,
      dayAgo: dayAgo
    }),
    [selectedFilter, dayAgo]
  )

  // console.log('key', orderKeys.list(orderFilter))
  const { data: meData, isPending: isLoadingUser } = useMe()
  const { orders, isLoading: isLoadingOrders, isRefetching, refetch } = useOrders(orderFilter)

  // Mutations for transfer and merge table
  const changeTableMutation = useChangeTable(selectedOrder?.orderID!, {
    onSuccess: () => {
      setShowTransferModal(false)

      setSelectedOrder(null)
      refetch()
    },
    onError: () => {
      setShowTransferModal(false)

      setSelectedOrder(null)
    }
  })
  const paymentMutation = usePayment(selectedOrder?.orderID!, {
    onSuccess: () => {
      setShowPaymentModal(false)
      setSelectedOrder(null)
    },
    onError: () => {
      setShowPaymentModal(false)
      setSelectedOrder(null)
    }
  })

  useEffect(() => {
    if (params.filter) {
      const filterValue = params.filter
      if (
        filterValue === STATUS.ORDER.UNPAID ||
        filterValue === STATUS.ORDER.PAID ||
        filterValue === STATUS.ORDER.CANCELED ||
        filterValue === STATUS.ORDER.NO_COLLECTED
      ) {
        setSelectedFilter(filterValue as OrderStatus)
        setDayAgo(0)
      } else {
        setSelectedFilter(STATUS.ORDER.UNPAID)
      }
    } else {
      setSelectedFilter(STATUS.ORDER.UNPAID)
    }
  }, [params.filter])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }, [refetch])

  const handleChangeStatus = (status: OrderStatus) => {
    setSelectedFilter(status)
    setDayAgo(0)
  }

  // Handle payment action
  const handlePayment = (order: Order) => {
    setSelectedOrder(order)
    setShowPaymentModal(true)
  }

  // Handle transfer table action - open modal
  const handleTransferTable = (order: Order) => {
    setSelectedOrder(order)
    setCurrentTableId(order.dinnerTable.id)
    setShowTransferModal(true)
  }

  // Handle transfer table from modal
  const handleTransferTableSubmit = (tableId: number) => {
    changeTableMutation.mutate(tableId)
  }

  const handlePaymnetSubmit = (paymentMethod: PaymentMethod) => {
    paymentMutation.mutate(paymentMethod)
  }

  const isInitialLoad = isLoadingOrders && orders.length === 0

  const ListHeader = useMemo(
    () => (
      <View className='flex-row items-center justify-between mb-2'>
        <Text className='text-lg font-bold' style={{ color: colors.text }}>
          Tổng cộng: {orders.length} bàn
        </Text>

        <View className='flex-row items-center gap-2'>
          {selectedFilter !== STATUS.ORDER.UNPAID ? (
            <DateFilterPicker value={dayAgo} onChange={setDayAgo} todayOnly={false} colors={colors} />
          ) : (
            <DateFilterPicker value={dayAgo} onChange={setDayAgo} todayOnly={true} colors={colors} />
          )}
          {/* {isRefetching && <ActivityIndicator size='small' color={colors.primary} />} */}
        </View>
      </View>
    ),
    [colors, orders.length, selectedFilter, dayAgo]
  )

  const EmptyComponent = useMemo(() => {
    const showLoading = isLoadingOrders || (isRefetching && orders.length === 0)

    if (showLoading) {
      return (
        <View className='items-center justify-center py-20'>
          <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
            <Ionicons name='time-outline' size={48} color={colors.primary} />
          </View>
          <Text className='text-lg font-semibold mt-2' style={{ color: colors.text }}>
            Đang tải đơn hàng...
          </Text>
          <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      )
    }

    return (
      <View className='items-center justify-center py-32'>
        <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
          <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
        </View>
        <Text className='text-xl font-bold mt-2' style={{ color: colors.text }}>
          Chưa có đơn hàng
        </Text>
        <Text className='text-sm mt-2 text-center px-8' style={{ color: colors.textSecondary }}>
          Không có đơn hàng {ORDER_STATUS_LABEL[selectedFilter as OrderStatus].toLowerCase()} nào
        </Text>
      </View>
    )
  }, [colors.primary, colors.text, colors.textSecondary, isLoadingOrders, isRefetching, orders.length, selectedFilter])

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header
        title='Xin chào'
        subtitle={isLoadingUser ? 'Đang tải...' : meData?.data?.fullName || 'Nhân viên'}
        showBackButton={false}
        rightContent={
          <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/profile')}
            className='bg-white/20 rounded-full p-3'
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }}
            activeOpacity={0.7}
          >
            <Ionicons name='person-circle-outline' size={28} color='white' />
          </TouchableOpacity>
        }
      >
        <OrderFilterChips selected={selectedFilter} onChange={handleChangeStatus} colors={colors} />
      </Header>

      {/* Orders List - only mount when first load done to avoid list jump */}
      {isInitialLoad ? (
        <View className='flex-1 items-center justify-center py-20'>
          <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
            <Ionicons name='time-outline' size={48} color={colors.primary} />
          </View>
          <Text className='text-lg font-semibold mt-2' style={{ color: colors.text }}>
            Đang tải đơn hàng...
          </Text>
          <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderID.toString()}
          numColumns={3}
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100
          }}
          columnWrapperStyle={{
            gap: 12,
            marginBottom: 8
          }}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyComponent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <View
              style={{
                flexBasis: '31%',
                maxWidth: '31%',
                marginBottom: 8
              }}
            >
              <OrderCard
                order={item}
                colors={colors}
                statusColors={status}
                effectiveTheme={effectiveTheme}
                onPressDetail={() => {
                  router.push(`/(protected)/order/detail?orderId=${item.orderID}` as any)
                }}
                onPressPayment={() => handlePayment(item)}
                onPressTransferTable={() => handleTransferTable(item)}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          removeClippedSubviews={false}
        />
      )}

      {/* Button Create Order */}
      <TouchableOpacity
        onPress={() => router.push('/(protected)/order/select-menu' as any)}
        className='absolute bottom-6 right-6 rounded-full p-7'
        style={{
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8
        }}
        activeOpacity={0.8}
      >
        <Ionicons name='add' size={28} color='white' />
      </TouchableOpacity>

      {/* Transfer Table Modal */}
      <TransferTableModal
        visible={showTransferModal}
        mode='transfer'
        currentTableId={currentTableId ?? undefined}
        isSubmitting={changeTableMutation.isPending}
        onSelect={handleTransferTableSubmit}
        onClose={() => {
          setShowTransferModal(false)
          setSelectedOrder(null)
          setCurrentTableId(null)
        }}
        colors={colors}
      />
      <PaymentMethodModal
        visible={showPaymentModal}
        totalAmount={selectedOrder?.totalAmount ?? 0}
        isSubmitting={paymentMutation.isPending}
        onSelect={handlePaymnetSubmit}
        onClose={() => {
          setShowPaymentModal(false)
          setSelectedOrder(null)
        }}
        colors={colors}
      />
    </View>
  )
}
