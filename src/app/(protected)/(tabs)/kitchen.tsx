import { Header } from '@/components/layouts/Header'
import { FilterChip } from '@/components/molecules/FilterChip'
import { CancelItemModal } from '@/features/order/components/organisms/CancelItemModal'
import { KitchenOrderSection } from '@/features/order/components/organisms/KitchenOrderSection'
import { useKitchenOrders, useUpdateOrderDetailStatus } from '@/features/order/hooks/useKitchenOrder'
import type { OrderDetail } from '@/features/order/types/order.type'
import { getAvailableTransitions, type TransitionAction } from '@/shared/constants/orderItemTransitions'
import {
  ORDER_DETAIL_STATUS_ICON,
  ORDER_ITEM_STATUS,
  ORDER_ITEM_STATUS_LABEL,
  ORDER_ITEM_STATUS_OPTIONS,
  STATUS,
  type OrderItemStatus
} from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { getKeyByValue } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'

export default function KitchenScreen() {
  const { colors } = useTheme()
  const [selectedStatus, setSelectedStatus] = useState<OrderItemStatus>(ORDER_ITEM_STATUS.PENDING)
  const [checkedItems, setCheckedItems] = useState<Map<number, Set<number>>>(new Map())
  const [cancelModalVisible, setCancelModalVisible] = useState(false)

  const { orders, isLoading, isRefetching, refetch } = useKitchenOrders({ orderItemStatusId: selectedStatus })

  useFocusEffect(
    useCallback(() => {
      refetch()

      return () => {
        setSelectedStatus(ORDER_ITEM_STATUS.PENDING)
        setCheckedItems(new Map())
      }
    }, [refetch])
  )

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
  const getAvailableActions = useCallback((): TransitionAction[] => {
    const actions: TransitionAction[] = []
    const seenStatuses = new Set<OrderItemStatus>()

    for (const [orderId, itemSet] of checkedItems) {
      const matchingOrders = orders.filter((o) => o.orderId === orderId)

      for (const itemId of itemSet) {
        const order = matchingOrders.find((o) => o.items.some((i) => i.id === itemId))
        if (!order) continue

        const item = order.items.find((i) => i.id === itemId)
        if (!item) continue
        const currentStatus = item.status.id as OrderItemStatus
        const available = getAvailableTransitions(currentStatus)
        for (const targetStatus of available) {
          if (!seenStatuses.has(targetStatus)) {
            seenStatuses.add(targetStatus)
            actions.push({
              status: currentStatus,
              label: ORDER_ITEM_STATUS_LABEL[targetStatus],
              icon: ORDER_DETAIL_STATUS_ICON[targetStatus],
              nextStatus: targetStatus
            })
          }
        }
      }
    }
    return actions
  }, [checkedItems, orders])

  const handleChangeFilter = (filter: OrderItemStatus) => {
    setCheckedItems(new Map())
    setSelectedStatus(filter)
  }

  const availableActions = useMemo(() => getAvailableActions(), [getAvailableActions])
  const canCheck = selectedStatus === ORDER_ITEM_STATUS.PENDING || selectedStatus === ORDER_ITEM_STATUS.INPROGRESS

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text className='text-base' style={{ color: colors.textSecondary }}>
            Đang tải...
          </Text>
        </View>
      )
    }

    return (
      <View className='flex-1 items-center justify-center px-8 py-20'>
        <View className='mb-4 rounded-full p-6' style={{ backgroundColor: `${colors.primary}10` }}>
          <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
        </View>
        <Text className='text-lg font-bold' style={{ color: colors.text }}>
          Không có món{' '}
          {selectedStatus === STATUS.ORDER_ITEM.PENDING
            ? 'đang cần làm'
            : selectedStatus === STATUS.ORDER_ITEM.INPROGRESS
              ? 'đang làm'
              : selectedStatus === STATUS.ORDER_ITEM.COMPLETED
                ? 'đã hoàn thành'
                : selectedStatus === STATUS.ORDER_ITEM.CANCELLED
                  ? 'đã huỷ'
                  : 'tồn tại'}
        </Text>
        {/* <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
          Tất cả các món đã được xử lý hoặc không có đơn hàng nào
        </Text> */}
      </View>
    )
  }
  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Quản lý món' showBackButton={false}>
        <FilterChip
          options={ORDER_ITEM_STATUS_OPTIONS}
          selected={selectedStatus}
          onChange={handleChangeFilter}
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
        extraData={[orders, checkedItems]}
        keyExtractor={(item) => `${item.orderId}-${item.items?.[0]?.createdDate}`}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 32
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        refreshing={isRefetching}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <KitchenOrderSection
            order={item}
            checkedItems={checkedItems.get(item.orderId) || new Set()}
            onToggleCheck={(orderItem) => toggleCheckItem(item.orderId, orderItem)}
            canCheck={canCheck}
            colors={colors}
          />
        )}
      />

      {getTotalCheckedCount() > 0 && (
        <View
          className='absolute bottom-0 left-0 right-0 gap-3 px-4 py-4'
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
            className='flex-1 items-center rounded-xl py-4'
            style={{ backgroundColor: colors.border }}
          >
            <Text className='font-semibold' style={{ color: colors.text }}>
              Bỏ chọn ({getTotalCheckedCount()})
            </Text>
          </TouchableOpacity>

          {availableActions.length > 0 &&
            availableActions.map((action) => {
              const isCancelAction = action.nextStatus === ORDER_ITEM_STATUS.CANCELLED
              const buttonColor = isCancelAction ? '#EF4444' : colors.primary
              const iconName = isCancelAction ? 'close-outline' : action.icon

              return (
                <TouchableOpacity
                  key={action.nextStatus}
                  onPress={isCancelAction ? handleCancelItems : () => handleUpdateStatus(action.nextStatus)}
                  disabled={updateStatusMutation.isPending}
                  className='flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4'
                  style={{ backgroundColor: buttonColor }}
                >
                  {updateStatusMutation.isPending ? (
                    <ActivityIndicator size='small' color='white' />
                  ) : (
                    <>
                      <Ionicons name={iconName} size={18} color='white' />
                      <Text className='font-semibold text-white'>{action.label}</Text>
                    </>
                  )}
                </TouchableOpacity>
              )
            })}
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
