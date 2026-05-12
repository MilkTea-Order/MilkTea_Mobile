import { Header } from '@/components/layouts/Header'
import { FilterChip } from '@/components/organisms/OrderFilterChips'
import { CancelItemModal } from '@/features/order/components/organisms/CancelItemModal'
import { KitchenOrderSection } from '@/features/order/components/organisms/KitchenOrderSection'
import { useKitchenOrders, useUpdateOrderDetailStatus } from '@/features/order/hooks/useKitchenOrder'
import type { OrderDetail } from '@/features/order/types/order.type'
import { ORDER_ITEM_STATUS, ORDER_ITEM_STATUS_OPTIONS, STATUS, type OrderItemStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { getKeyByValue } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function KitchenScreen() {
  const { colors } = useTheme()
  const [selectedStatus, setSelectedStatus] = useState<OrderItemStatus>(ORDER_ITEM_STATUS.PENDING)
  const [checkedItems, setCheckedItems] = useState<Map<number, Set<number>>>(new Map())
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  console.log('check', checkedItems)
  const filter = useMemo(() => getKeyByValue(STATUS.ORDER_ITEM, selectedStatus), [selectedStatus])

  const { orders, isLoading, isRefetching, refetch } = useKitchenOrders(filter)

  const updateStatusMutation = useUpdateOrderDetailStatus({
    onSuccess: () => {
      setCheckedItems(new Map())
    }
  })

  const toggleCheckItem = useCallback((orderId: number, item: OrderDetail) => {
    setCheckedItems((prev) => {
      const newMap = new Map(prev)
      const orderSet = newMap.get(orderId) || new Set()

      const newSet = new Set(orderSet)
      if (newSet.has(item.id)) {
        newSet.delete(item.id)
      } else {
        newSet.add(item.id)
      }

      if (newSet.size === 0) {
        newMap.delete(orderId)
      } else {
        newMap.set(orderId, newSet)
      }

      return newMap
    })
  }, [])

  const getTotalCheckedCount = useCallback(() => {
    let count = 0
    checkedItems.forEach((set) => {
      count += set.size
    })
    return count
  }, [checkedItems])

  const handleUpdateStatus = (newStatus: OrderItemStatus, reason?: string) => {
    const totalCount = getTotalCheckedCount()
    if (totalCount === 0) return

    const itemsToUpdate = Array.from(checkedItems.entries()).flatMap(([orderId, itemSet]) =>
      Array.from(itemSet).map((itemId) => ({
        orderId,
        orderDetailId: itemId,
        status: getKeyByValue(STATUS.ORDER_ITEM, newStatus) as keyof typeof ORDER_ITEM_STATUS,
        reason
      }))
    )

    Alert.alert('Xác nhận', `Bạn muốn cập nhật ${totalCount} món?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xác nhận', onPress: () => updateStatusMutation.mutate(itemsToUpdate) }
    ])
  }

  const handleCancelItems = () => {
    setCancelModalVisible(true)
  }

  const handleCancelConfirm = (reason: string) => {
    handleUpdateStatus(ORDER_ITEM_STATUS.CANCELLED, reason)
  }

  const canUpdateToInProgress = useMemo(() => {
    for (const [orderId, itemSet] of checkedItems) {
      const order = orders.find((o) => o.orderID === orderId)
      if (!order) continue

      for (const itemId of itemSet) {
        const item = order.items.find((i) => i.id === itemId)
        if (item?.status.id === ORDER_ITEM_STATUS.PENDING) {
          return true
        }
      }
    }
    return false
  }, [checkedItems, orders])

  const canUpdateToCompleted = useMemo(() => {
    for (const [orderId, itemSet] of checkedItems) {
      const order = orders.find((o) => o.orderID === orderId)
      if (!order) continue

      for (const itemId of itemSet) {
        const item = order.items.find((i) => i.id === itemId)
        if (item?.status.id === ORDER_ITEM_STATUS.INPROGRESS) {
          return true
        }
      }
    }
    return false
  }, [checkedItems, orders])

  const canUpdateToCancelled = useMemo(() => {
    for (const [orderId, itemSet] of checkedItems) {
      const order = orders.find((o) => o.orderID === orderId)
      if (!order) continue

      for (const itemId of itemSet) {
        const item = order.items.find((i) => i.id === itemId)
        if (item?.status.id === ORDER_ITEM_STATUS.PENDING) {
          return true
        }
      }
    }
    return false
  }, [checkedItems, orders])

  const canCheck = selectedStatus === ORDER_ITEM_STATUS.PENDING || selectedStatus === ORDER_ITEM_STATUS.INPROGRESS

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className='flex-1 justify-center items-center py-20'>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text className='mt-3 text-base' style={{ color: colors.textSecondary }}>
            Đang tải...
          </Text>
        </View>
      )
    }

    return (
      <View className='flex-1 justify-center items-center py-20 px-8'>
        <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
          <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
        </View>
        <Text className='text-lg font-bold' style={{ color: colors.text }}>
          Không có món cần làm
        </Text>
        <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
          Tất cả các món đã được xử lý hoặc không có đơn hàng nào
        </Text>
      </View>
    )
  }
  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Quản lý món' showBackButton={false}>
        <FilterChip
          options={ORDER_ITEM_STATUS_OPTIONS}
          selected={selectedStatus}
          onChange={setSelectedStatus}
          selectedStyle={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            textColor: 'white',
            iconColor: 'white'
          }}
          unselectedStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderColor: 'rgba(255,255,255,0.4)',
            textColor: 'white',
            iconColor: 'white'
          }}
        />
      </Header>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderID.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: getTotalCheckedCount() > 0 ? 120 : 32
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        refreshing={isRefetching}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <KitchenOrderSection
            order={item}
            checkedItems={checkedItems.get(item.orderID) || new Set()}
            onToggleCheck={(orderItem) => toggleCheckItem(item.orderID, orderItem)}
            canCheck={canCheck}
            colors={colors}
          />
        )}
      />

      {getTotalCheckedCount() > 0 && (
        <View
          className='absolute bottom-0 left-0 right-0 px-4 py-4 gap-3'
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: 32,
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            onPress={() => setCheckedItems(new Map())}
            className='flex-1 py-4 rounded-xl items-center'
            style={{ backgroundColor: colors.border }}
          >
            <Text className='font-semibold' style={{ color: colors.text }}>
              Bỏ chọn ({getTotalCheckedCount()})
            </Text>
          </TouchableOpacity>

          {(canUpdateToInProgress || canUpdateToCompleted) && (
            <>
              {canUpdateToInProgress && (
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(ORDER_ITEM_STATUS.INPROGRESS)}
                  disabled={updateStatusMutation.isPending}
                  className='flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2'
                  style={{ backgroundColor: colors.primary }}
                >
                  {updateStatusMutation.isPending ? (
                    <ActivityIndicator size='small' color='white' />
                  ) : (
                    <>
                      <Ionicons name='play-outline' size={18} color='white' />
                      <Text className='font-semibold text-white'>Bắt đầu làm</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {canUpdateToCompleted && (
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(ORDER_ITEM_STATUS.COMPLETED)}
                  disabled={updateStatusMutation.isPending}
                  className='flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2'
                  style={{ backgroundColor: '#22C55E' }}
                >
                  {updateStatusMutation.isPending ? (
                    <ActivityIndicator size='small' color='white' />
                  ) : (
                    <>
                      <Ionicons name='checkmark-outline' size={18} color='white' />
                      <Text className='font-semibold text-white'>Hoàn thành</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}

          {canUpdateToCancelled && (
            <TouchableOpacity
              onPress={handleCancelItems}
              disabled={updateStatusMutation.isPending}
              className='flex-1 py-4 rounded-xl items-center flex-row justify-center gap-2'
              style={{ backgroundColor: '#EF4444' }}
            >
              {updateStatusMutation.isPending ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <>
                  <Ionicons name='close-outline' size={18} color='white' />
                  <Text className='font-semibold text-white'>Hủy món</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      <CancelItemModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onSubmit={handleCancelConfirm}
        itemCount={getTotalCheckedCount()}
      />
    </View>
  )
}
