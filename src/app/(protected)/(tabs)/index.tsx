import withFloatingButton from '@/components/hoc/withFloatingButton'
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
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { colors, status, effectiveTheme } = useTheme()

  const [orderFilter, setOrderFilter] = useState<OrderFilter>({ statusId: STATUS.ORDER.UNPAID, dayAgo: null })
  const [refreshing, setRefreshing] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  // const [currentTableId, setCurrentTableId] = useState<number | null>(null)

  const router = useRouter()
  const params = useLocalSearchParams<{ filter?: OrderStatus }>()

  const { data: meData, isPending: isLoadingUser } = useMe()
  const { orders, isLoading: isLoadingOrders, isRefetching, refetch } = useOrders(orderFilter)

  // Mutation
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
      if ([STATUS.ORDER.NO_COLLECTED, STATUS.ORDER.CANCELED, STATUS.ORDER.PAID].includes(filterValue as any)) {
        setOrderFilter({ dayAgo: 0, statusId: filterValue })
      }
    }
  }, [params.filter])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }, [refetch])

  const handleChangeStatus = (status: OrderStatus) => {
    if ([STATUS.ORDER.NO_COLLECTED, STATUS.ORDER.CANCELED, STATUS.ORDER.PAID].includes(status as any)) {
      setOrderFilter({ dayAgo: 0, statusId: status })
    } else {
      setOrderFilter({ dayAgo: null, statusId: status })
    }
  }

  // Handle payment action
  const handlePayment = (order: Order) => {
    setSelectedOrder(order)
    setShowPaymentModal(true)
  }

  // Handle transfer table action - open modal
  const handleTransferTable = (order: Order) => {
    setSelectedOrder(order)
    setShowTransferModal(true)
  }

  // Handle transfer table from modal
  const handleTransferTableSubmit = (tableId: number) => {
    Alert.alert('Xác nhận', `Bạn muốn chuyền Bàn ${selectedOrder?.dinnerTable.id} sang Bàn ${tableId}?`, [
      {
        text: 'Xác nhận',
        style: 'destructive',
        onPress: () => {
          changeTableMutation.mutate(tableId)
        }
      },
      { text: 'Không', style: 'cancel' }
    ])
  }

  const handlePaymnetSubmit = (paymentMethod: PaymentMethod) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có muốn thanh toán Bàn ${selectedOrder?.dinnerTable.id} với tổng tiền ${formatCurrencyVND(selectedOrder?.totalAmount ?? 0)}?`,
      [
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: () => {
            paymentMutation.mutate(paymentMethod)
          }
        },
        { text: 'Không', style: 'cancel' }
      ]
    )
  }

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
          Không có đơn hàng {ORDER_STATUS_LABEL[orderFilter.statusId].toLowerCase()} nào
        </Text>
      </View>
    )
  }, [colors.primary, colors.text, colors.textSecondary, isLoadingOrders, isRefetching, orders.length, orderFilter])

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
        <OrderFilterChips selected={orderFilter.statusId} onChange={handleChangeStatus} colors={colors} />
      </Header>
      <ContentWithFab
        orders={orders}
        colors={colors}
        status={status}
        effectiveTheme={effectiveTheme}
        orderFilter={orderFilter}
        setOrderFilter={setOrderFilter}
        refreshing={refreshing}
        onRefresh={onRefresh}
        handlePayment={handlePayment}
        handleTransferTable={handleTransferTable}
        router={router}
        EmptyComponent={EmptyComponent}
      />

      {/* Transfer Table Modal */}
      <TransferTableModal
        visible={showTransferModal}
        mode='transfer'
        currentTableId={selectedOrder?.dinnerTable.id ?? undefined}
        isSubmitting={changeTableMutation.isPending}
        onSelect={handleTransferTableSubmit}
        onClose={() => {
          setShowTransferModal(false)
          setSelectedOrder(null)
          // setCurrentTableId(null)
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

function ContentComponent(props: {
  orders: Order[]
  colors: any
  status: any
  effectiveTheme: any
  orderFilter: OrderFilter
  setOrderFilter: any
  refreshing: boolean
  onRefresh: () => void
  handlePayment: (order: Order) => void
  handleTransferTable: (order: Order) => void
  router: any
  EmptyComponent: any
}) {
  const {
    orders,
    colors,
    status,
    effectiveTheme,
    orderFilter,
    setOrderFilter,
    refreshing,
    onRefresh,
    handlePayment,
    handleTransferTable,
    router,
    EmptyComponent
  } = props

  return (
    <>
      <View className='flex-row items-center justify-between m-3 mb-0'>
        <Text className='text-lg font-bold' style={{ color: colors.text }}>
          Tổng cộng: {orders?.length ?? 0} bàn
        </Text>

        <View className='flex-row items-center gap-2'>
          {orderFilter.statusId !== STATUS.ORDER.UNPAID && (
            <DateFilterPicker
              value={orderFilter.dayAgo!}
              onChange={(dayAgo: number) => setOrderFilter((prev: any) => ({ ...prev, dayAgo }))}
              todayOnly={false}
              colors={colors}
            />
          )}
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderID.toString()}
        numColumns={3}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: 12, marginBottom: 8 }}
        ListEmptyComponent={EmptyComponent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <View style={{ flexBasis: '31%', maxWidth: '31%', marginBottom: 8 }}>
            <OrderCard
              order={item}
              colors={colors}
              statusColors={status}
              effectiveTheme={effectiveTheme}
              onPressDetail={() => router.push(`/(protected)/order/detail?orderId=${item.orderID}` as any)}
              onPressPayment={() => handlePayment(item)}
              onPressTransferTable={() => handleTransferTable(item)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

const ContentWithFab = withFloatingButton(ContentComponent, () => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => router.push('/(protected)/order/select-menu')}
    className='rounded-full p-7'
    style={{
      backgroundColor: '#FB923C',
      shadowColor: '#FB923C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8
    }}
  >
    <Ionicons name='add' size={28} color='white' />
  </TouchableOpacity>
))
