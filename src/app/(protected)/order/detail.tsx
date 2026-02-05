import { Header } from '@/components/layouts/Header'
import { OrderNotFoundState } from '@/features/order/components/molecules/OrderNotFoundState'
import { OrderActionPanel } from '@/features/order/components/organisms/OrderActionPanel'
import { OrderItemsSection } from '@/features/order/components/organisms/OrderItemsSection'
import { useCancelOrderItems, useOrderDetail } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { ERROR_CODE } from '@/shared/constants/errorCode'
import { ORDER_FLOW_MODE } from '@/shared/constants/other'
import { ORDER_STATUS_LABEL, STATUS, type OrderStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { extractErrorDetails } from '@/shared/utils/formErrors'
import { formatCurrency } from '@/shared/utils/utils'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

export default function OrderDetailScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const orderIdNumber = orderId ? parseInt(orderId, 10) : null

  const [filterMode, setFilterMode] = useState<'placed' | 'cancelled'>('placed')
  const [cancellingItemId, setCancellingItemId] = useState<number | null>(null)
  const { order, isLoading, isRefetching, refetch } = useOrderDetail(orderIdNumber, filterMode === 'cancelled')

  const cancelMutation = useCancelOrderItems(orderIdNumber!, {
    onSuccess: (data) => {
      setCancellingItemId(null)
      if (data.data.cancelledDetailIDs.length > 0) {
        Alert.alert('Thành công', 'Hủy món thành công')
      }
    },
    onError: (error: any) => {
      setCancellingItemId(null)

      const details = extractErrorDetails(error, 'order')

      const orderIdError = details.find((e) => e.field.toLowerCase() === 'orderid')
      if (orderIdError) {
        if (orderIdError.code === ERROR_CODE.E0001 || orderIdError.code === ERROR_CODE.E0036) {
          Alert.alert('Lỗi', orderIdError.message, [
            { text: 'OK', onPress: () => router.replace('/(protected)/(tabs)') }
          ])
          return
        }

        if (orderIdError.code === ERROR_CODE.E0042) {
          Alert.alert('Lỗi', orderIdError.message)
          return
        }
      }

      const detailIdsError = details.find((e) => e.field.toLowerCase() === 'orderdetailids')
      if (detailIdsError) {
        if (detailIdsError.code === ERROR_CODE.E0001 || detailIdsError.code === ERROR_CODE.E0036) {
          Alert.alert('Lỗi', detailIdsError.message, [
            { text: 'OK', onPress: () => router.replace('/(protected)/(tabs)') }
          ])
          return
        }
      }

      const systemError = details.find((e) => e.field.toLowerCase() === 'cancelorderdetails')
      if (systemError) {
        if (systemError.code === ERROR_CODE.E9999) {
          Alert.alert('Lỗi', systemError.message)
          return
        }
      }
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại')
    }
  })

  const handleFilterToggle = () => {
    setFilterMode((prev) => (prev === 'placed' ? 'cancelled' : 'placed'))
  }

  const handleCancelItem = (orderDetailId: number) => {
    if (!orderIdNumber) return
    setCancellingItemId(orderDetailId)
    cancelMutation.mutate([orderDetailId])
  }

  if (!order && !isLoading) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Chi tiết đơn hàng' />
        <OrderNotFoundState colors={colors} />
      </View>
    )
  }

  const orderStatus = String(order?.statusID ?? '') as OrderStatus
  const statusName = isLoading ? 'Đang tải...' : (order?.status?.name ?? ORDER_STATUS_LABEL[orderStatus] ?? '')
  const totalQty = order?.orderDetails?.reduce((sum, d) => sum + (d.quantity ?? 0), 0) ?? 0

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header
        title='Chi tiết đơn hàng'
        subtitle={statusName}
        rightContent={
          <View className='items-end'>
            <Text className='text-white/85 text-xs font-semibold'>Tổng tiền</Text>
            <Text className='text-white text-lg font-bold mt-0.5' numberOfLines={1}>
              {formatCurrency(order?.totalAmount ?? 0)}
            </Text>
          </View>
        }
      />

      {/* Content */}
      <View className='flex-1 p-4' style={{ backgroundColor: colors.background }}>
        <OrderActionPanel
          filterMode={filterMode}
          onFilterToggle={handleFilterToggle}
          onAddItems={() => {
            if (!orderIdNumber || !order) return

            useOrderStore.getState().clear()
            useOrderStore.getState().setMode(ORDER_FLOW_MODE.ADD_ITEMS)
            useOrderStore.getState().setTargetOrderId(orderIdNumber)
            useOrderStore.getState().setTable({
              tableID: Number(order.dinnerTableID ?? 0),
              tableName: String(order.dinnerTable?.name ?? ''),
              numberOfSeat: Number(order.dinnerTable?.numberOfSeats ?? 0)
            } as any)

            router.push('/(protected)/order/select-menu')
          }}
          colors={colors}
        />

        <OrderItemsSection
          items={order?.orderDetails ?? []}
          canActionButton={filterMode === 'placed' && Number(order?.statusID ?? 0) === Number(STATUS.ORDER.UNPAID)}
          totalQty={totalQty}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onCancelItem={handleCancelItem}
          onUpdateItem={(orderDetailId) => {
            const detail = (order?.orderDetails ?? []).find((d: any) => Number(d.id) === Number(orderDetailId))
            if (!detail || !orderIdNumber) return

            useOrderStore.getState().clear()
            useOrderStore.getState().setMode(ORDER_FLOW_MODE.UPDATE_ITEMS)
            useOrderStore.getState().setTargetOrderId(orderIdNumber)
            useOrderStore.getState().setEditingOrderDetailId(Number(orderDetailId))

            useOrderStore.getState().add({
              menuId: Number(detail.menuID ?? 0),
              menuName: detail.menu?.name ?? `Món #${detail.menuID}`,
              menuImage: null,
              sizeId: Number(detail.size?.id ?? 0),
              sizeName: detail.size?.name ?? '',
              price: Number(detail.price ?? 0),
              quantity: Number(detail.quantity ?? 1),
              note: detail.note ?? null
            })

            router.push({
              pathname: '/(protected)/order/item-detail',
              params: {
                menuId: String(detail.menuID ?? ''),
                sizeId: String(detail.size?.id ?? '')
              }
            })
          }}
          cancellingItemId={cancellingItemId}
          colors={colors}
        />
      </View>
    </View>
  )
}

// order.orderDetails.map((item, index) => (
//   <View
//     key={item.id}
//     className='flex-row items-start justify-between py-4'
//     style={{
//       borderBottomWidth: index !== order.orderDetails.length - 1 ? 1 : 0,
//       borderBottomColor: colors.border
//     }}
//   >
//     <View className='flex-1 mr-4'>
//       <View className='flex-row items-center mb-2'>
//         <Text className='text-base font-bold flex-1' style={{ color: colors.text }}>
//           {item.menu?.name ?? `Món #${item.menuID}`}
//         </Text>
//         {item.menu?.unitName && (
//           <Text
//             className='text-xs px-2 py-1 rounded ml-2'
//             style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
//           >
//             {item.menu.unitName}
//           </Text>
//         )}
//       </View>
//       <View className='flex-row items-center flex-wrap mb-2' style={{ gap: 8 }}>
//         <View className='flex-row items-center'>
//           <Text className='text-sm' style={{ color: colors.textSecondary }}>
//             {formatCurrency(item.price)}
//           </Text>
//           <Text className='text-sm mx-2' style={{ color: colors.textSecondary }}>
//             ×
//           </Text>
//           <Text className='text-sm font-semibold' style={{ color: colors.textSecondary }}>
//             {item.quantity}
//           </Text>
//         </View>
//         {item.size?.name && (
//           <View className='px-2 py-1 rounded' style={{ backgroundColor: colors.border }}>
//             <Text className='text-xs font-semibold' style={{ color: colors.textSecondary }}>
//               Size: {item.size.name}
//             </Text>
//           </View>
//         )}
//       </View>
//       {item.note && (
//         <View className='mt-1 flex-row items-start'>
//           <Ionicons
//             name='document-text-outline'
//             size={12}
//             color={colors.textSecondary}
//             style={{ marginRight: 4, marginTop: 2 }}
//           />
//           <Text className='text-xs flex-1 italic leading-4' style={{ color: colors.textSecondary }}>
//             {item.note}
//           </Text>
//         </View>
//       )}
//     </View>
//     <View className='items-end'>
//       <Text className='text-lg font-bold mb-1' style={{ color: colors.primary }}>
//         {formatCurrency(item.price * item.quantity)}
//       </Text>
//     </View>
//   </View>
// ))
