import { Header } from '@/components/layouts/Header'
import { OrderNotFoundState } from '@/features/order/components/molecules/OrderNotFoundState'
import { OrderActionChips } from '@/features/order/components/organisms/OrderActionChips'
import { OrderItemsSection } from '@/features/order/components/organisms/OrderItemsSection'
import { PaymentMethodModal } from '@/features/order/components/organisms/PaymentMethodModal'
import { TransferTableModal } from '@/features/order/components/organisms/TransferTableModal'
import {
  useCancelOrder,
  useCancelOrderItems,
  useChangeTable,
  useCollectedOrder,
  useMergeTable,
  useOrderDetail,
  usePayment
} from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { OrderDetail } from '@/features/order/types/order.type'
import { ORDER_FLOW_MODE, PaymentMethod } from '@/shared/constants/other'
import { ORDER_STATUS_LABEL, STATUS, type OrderStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatCurrency } from '@/shared/utils/utils'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'

export default function OrderDetailScreen() {
  const { colors } = useTheme()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const router = useRouter()
  const orderIdNumber = orderId ? parseInt(orderId, 10) : null
  const [filterMode, setFilterMode] = useState<'placed' | 'cancelled'>('placed')
  const { order, isLoading, isRefetching, refetch } = useOrderDetail(orderIdNumber, filterMode === 'cancelled')
  const [cancellingItemId, setCancellingItemId] = useState<number | null>(null)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const cancelMutation = useCancelOrderItems(orderIdNumber!, {
    onSuccess: () => {
      setCancellingItemId(null)
    },
    onError: () => {
      setCancellingItemId(null)
    }
  })

  const collectedMutation = useCollectedOrder(orderIdNumber!)

  const cancelOrderMutation = useCancelOrder()

  const changeTableMutation = useChangeTable(orderIdNumber!, {
    onSuccess: () => {
      setShowTransferModal(false)
    },
    onError: () => {
      setShowTransferModal(false)
    }
  })

  const mergeTableMutation = useMergeTable(orderIdNumber!, {
    onSuccess: () => {
      setShowMergeModal(false)
    },
    onError: () => {
      setShowMergeModal(false)
    }
  })

  const paymentMutation = usePayment(orderIdNumber!, {
    onSuccess: () => {
      setShowPaymentModal(false)
    },
    onError: () => {
      setShowPaymentModal(false)
    }
  })

  const handlePayment = (paymentMethod: PaymentMethod) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có muốn thanh toán ${order?.dinnerTable.name} (${formatCurrencyVND(order?.totalAmount ?? 0)})?`,
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

  const handleCollectedOrder = () => {
    Alert.alert(
      'Xác nhận',
      `Bạn đã thu tiền ${order?.dinnerTable.name} (${formatCurrencyVND(order?.totalAmount ?? 0)})?`,
      [
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: () => {
            collectedMutation.mutate()
          }
        },
        { text: 'Không', style: 'cancel' }
      ]
    )
  }

  const handleCancelItem = (item: OrderDetail) => {
    if (!item) return
    Alert.alert(
      'Xác nhận',
      order?.orderDetails.length === 1
        ? `Bạn muốn huỷ món "${item.menu.name} (${item.size.name})"?\n\nĐây là món cuối cùng. Huỷ món này sẽ huỷ luôn đơn hàng.`
        : `Bạn muốn huỷ món "${item.menu.name} (${item.size.name})"?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy món',
          style: 'destructive',
          onPress: () => {
            setCancellingItemId(item.id)
            cancelMutation.mutate(item.id)
          }
        }
      ]
    )
  }

  const handleFilterChange = (value: 'placed' | 'cancelled') => setFilterMode(value)

  const handleTransferTable = (tableId: number) => {
    Alert.alert('Xác nhận', `Bạn muốn chuyền ${order?.dinnerTable.name} sang Bàn ${tableId}?`, [
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

  const handleMergeTable = (tableId: number) => {
    Alert.alert('Xác nhận', `Bạn muốn gộp Bàn ${tableId} vào ${order?.dinnerTable.name}?`, [
      {
        text: 'Xác nhận',
        style: 'destructive',
        onPress: () => {
          mergeTableMutation.mutate(tableId)
        }
      },
      { text: 'Không', style: 'cancel' }
    ])
  }

  if (!order && !isLoading) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Chi tiết đơn hàng' />
        <OrderNotFoundState colors={colors} />
      </View>
    )
  }

  const orderStatus = String(order?.status.id ?? '') as OrderStatus
  const statusName = isLoading ? 'Đang tải...' : (ORDER_STATUS_LABEL[orderStatus] ?? '')
  const totalQty = order?.orderDetails?.reduce((sum, d) => sum + (d.quantity ?? 0), 0) ?? 0

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header
        title={order?.dinnerTable?.name ?? 'Chi tiết đơn hàng'}
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
        <View className='mb-4'>
          <OrderActionChips
            actions={[
              {
                id: 'chuyen-ban',
                label: 'Chuyển bàn',
                icon: 'swap-horizontal-outline',
                variant: 'info',
                visible: order?.status.id === Number(STATUS.ORDER.UNPAID),
                onPress: () => setShowTransferModal(true)
              },
              {
                id: 'gop-ban',
                label: 'Gộp bàn',
                icon: 'git-merge-outline',
                variant: 'warning',
                visible: order?.status.id === Number(STATUS.ORDER.UNPAID),
                onPress: () => setShowMergeModal(true)
              },
              {
                id: 'thanh-toan',
                label: 'Thanh toán',
                icon: 'card-outline',
                variant: 'primary',
                visible: order?.status.id === Number(STATUS.ORDER.UNPAID),
                onPress: () => setShowPaymentModal(true)
              },
              {
                id: 'huy-ban',
                label: 'Hủy bàn',
                icon: 'close-circle-outline',
                variant: 'danger',
                visible: order?.status.id === Number(STATUS.ORDER.UNPAID),
                onPress: () => {
                  Alert.alert('Xác nhận', 'Bạn muốn hủy toàn bộ đơn hàng này?', [
                    { text: 'Không', style: 'cancel' },
                    {
                      text: 'Hủy đơn',
                      style: 'destructive',
                      onPress: () => {
                        if (orderIdNumber) cancelOrderMutation.mutate(orderIdNumber)
                      }
                    }
                  ])
                }
              },
              {
                id: 'thu-tien',
                label: 'Đã thu tiền',
                icon: 'cash-outline',
                variant: 'primary',
                visible: order?.status.id === Number(STATUS.ORDER.NO_COLLECTED),
                onPress: handleCollectedOrder
              }
            ]}
            colors={colors}
          />
        </View>

        {/* Order Items Section */}
        <OrderItemsSection
          items={order?.orderDetails ?? []}
          canActionButton={filterMode === 'placed' && Number(order?.status.id ?? 0) === Number(STATUS.ORDER.UNPAID)}
          totalQty={totalQty}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onCancelItem={handleCancelItem}
          cancellingItemId={cancellingItemId}
          onUpdateItem={(orderDetailId) => {
            const detail = (order?.orderDetails ?? []).find((d: any) => Number(d.id) === Number(orderDetailId))
            if (!detail || !orderIdNumber) return
            useOrderStore.getState().clear()

            useOrderStore.getState().add({
              menuId: Number(detail.menu.id ?? 0),
              menuName: detail.menu?.name ?? `Món #${detail.menu.id}`,
              menuImage: null,
              sizeId: Number(detail.size?.id ?? 0),
              sizeName: detail.size?.name ?? '',
              sizeRank: detail.size.rankIndex,
              price: Number(detail.price ?? 0),
              quantity: Number(detail.quantity ?? 1),
              note: detail.note ?? null
            })
            router.push({
              pathname: '/(protected)/order/item-detail',
              params: {
                menuId: String(detail.menu.id ?? ''),
                sizeId: String(detail.size.id ?? ''),
                mode: ORDER_FLOW_MODE.UPDATE_ITEMS,
                orderId: String(orderIdNumber),
                orderDetailId: String(orderDetailId)
              }
            })
          }}
          filterMode={filterMode}
          onFilterChange={handleFilterChange}
          onAddItems={() => {
            if (!orderIdNumber || !order) return
            useOrderStore.getState().clear()
            useOrderStore.getState().setTable({
              id: Number(order.dinnerTable.id ?? 0),
              name: String(order.dinnerTable?.name ?? ''),
              numberOfSeats: Number(order.dinnerTable?.numberOfSeats ?? 0)
            } as any)
            router.push({
              pathname: '/(protected)/order/select-menu',
              params: {
                mode: String(ORDER_FLOW_MODE.ADD_ITEMS),
                orderId: String(orderIdNumber)
              }
            })
          }}
          colors={colors}
        />
      </View>
      <TransferTableModal
        visible={showTransferModal}
        mode='transfer'
        currentTableId={Number(order?.dinnerTable?.id ?? 0)}
        isSubmitting={changeTableMutation.isPending}
        onSelect={handleTransferTable}
        onClose={() => setShowTransferModal(false)}
        colors={colors}
      />
      <TransferTableModal
        visible={showMergeModal}
        mode='merge'
        currentTableId={Number(order?.dinnerTable?.id ?? 0)}
        isSubmitting={mergeTableMutation.isPending}
        onSelect={handleMergeTable}
        onClose={() => setShowMergeModal(false)}
        colors={colors}
      />
      <PaymentMethodModal
        visible={showPaymentModal}
        totalAmount={order?.totalAmount ?? 0}
        isSubmitting={paymentMutation.isPending}
        onSelect={handlePayment}
        onClose={() => setShowPaymentModal(false)}
        colors={colors}
      />
    </View>
  )
}
