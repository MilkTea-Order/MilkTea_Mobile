import { Header } from '@/components/layouts/Header'
import { CartItemCard } from '@/components/organisms/CartItemCard'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useAddOrderItems, useCreateOrder } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { ORDER_FLOW_MODE, OrderFlowMode } from '@/shared/constants/other'
import { STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function ReviewCartScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { mode, orderId } = useLocalSearchParams<{
    mode?: OrderFlowMode
    orderId?: string
  }>()

  const modeValue = mode ?? ORDER_FLOW_MODE.CREATE
  const isAddItemsMode = modeValue === ORDER_FLOW_MODE.ADD_ITEMS
  const targetOrderId = useMemo(() => (orderId ? Number(orderId) : NaN), [orderId])

  const authProfile = useAuthStore((s) => s.profile)

  const orderItems = useOrderStore((s) => s.items)
  const orderIncrement = useOrderStore((s) => s.increment)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const removeItem = useOrderStore((s) => s.removeItem)
  const clearOrder = useOrderStore((s) => s.clear)
  const totalPrice = useOrderStore((s) => s.totalPrice)

  // const selectedTable = useOrderStore.getState().table
  const selectedTable = useOrderStore((s) => s.table)

  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  const createOrderMutation = useCreateOrder()

  const addItemsMutation = useAddOrderItems(targetOrderId ?? 0, {
    onSuccess: () => {
      // Toast.show('Thêm món thành công', { type: 'success' })
      router.dismissAll()
      clearOrder()
    },
    onError: (err: any) => {
      if (err?.type === 'item') {
        setItemErrors({ [`${err.menuId}-${err.sizeId}`]: err.message })
      }
      if (err?.type === 'items') {
        const next: Record<string, string> = {}
        err.items.forEach((it: any) => {
          next[`${it.menuId}-${it.sizeId}`] = it.message
        })
        setItemErrors(next)
      }
    }
  })

  useFocusEffect(
    useCallback(() => {
      // const table = useOrderStore.getState().table
      if (!selectedTable) {
        router.replace('/(protected)/order/select-table')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])
  )

  const handleBack = () => router.back()

  const handleDecrement = (menuId: number, sizeId: number) => {
    const item = orderItems.find((x) => x.menuId === menuId && x.sizeId === sizeId)
    if (!item) return

    // Nếu quantity = 1, hiển thị confirm dialog
    if (item.quantity === 1) {
      Alert.alert('Xác nhận', 'Bạn muốn xóa món này khỏi giỏ hàng?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            removeItem(menuId, sizeId)
          }
        }
      ])
      return
    }

    // Nếu quantity > 1, giảm bình thường
    orderDecrement(menuId, sizeId)
  }

  const handleSubmit = () => {
    const table = useOrderStore.getState().table
    if (!table || !orderItems.length) return

    setItemErrors({})

    if (isAddItemsMode) {
      if (!targetOrderId) {
        Alert.alert('Lỗi', 'Không tìm thấy OrderID.')
        return
      }
      addItemsMutation.mutate({
        items: orderItems.map((item) => ({
          menuID: item.menuId,
          sizeID: item.sizeId,
          quantity: item.quantity,
          toppingIDs: [],
          kindOfHotpotIDs: [],
          note: item.note ?? null
        }))
      })
      return
    }

    const payload = {
      dinnerTableID: table.id,
      orderByID: Number(authProfile?.user?.id ?? 0),
      items: orderItems.map((item) => ({
        menuID: item.menuId,
        sizeID: item.sizeId,
        quantity: item.quantity,
        toppingIDs: [],
        kindOfHotpotIDs: [],
        note: item.note ?? null
      })),
      note: null
    }

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        clearOrder()
        router.replace({
          pathname: '/(protected)/(tabs)',
          params: {
            filter: STATUS.ORDER.UNPAID
          }
        })
      },
      onError: (error) => {
        clearOrder()
        router.replace('/(protected)/(tabs)')
      }
    })
  }

  if (!selectedTable) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Giỏ hàng' onBack={handleBack} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    )
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title={`${selectedTable?.name ?? ''} • Các món đã chọn `} onBack={handleBack} />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {/* Cart Items */}
        {orderItems.length === 0 ? (
          <View className='items-center py-16'>
            <View className='mb-4 rounded-full p-6' style={{ backgroundColor: `${colors.primary}10` }}>
              <Ionicons name='cart-outline' size={64} color={colors.primary} />
            </View>
            <Text className='mb-2 text-xl font-bold' style={{ color: colors.text }}>
              Giỏ hàng trống
            </Text>
            <Text className='mb-6 text-center text-sm' style={{ color: colors.textSecondary }}>
              Hãy thêm món vào giỏ hàng để tiếp tục
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className='rounded-xl px-8 py-3'
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}
            >
              <Text className='text-base font-semibold text-white'>Tiếp tục mua hàng</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className='mb-3 flex-row items-center justify-between'>
              <Text className='text-xl font-bold' style={{ color: colors.text }}>
                Danh sách món
              </Text>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
                <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                  Thêm món
                </Text>
              </TouchableOpacity>
            </View>

            {orderItems.map((item) => {
              return (
                <CartItemCard
                  key={`${item.menuId}-${item.sizeId}`}
                  item={item}
                  error={itemErrors[`${item.menuId}-${item.sizeId}`]}
                  onIncrement={(menuId, sizeId) => orderIncrement(menuId, sizeId)}
                  onDecrement={(menuId, sizeId) => handleDecrement(menuId, sizeId)}
                  onEdit={(menuId, sizeId) => {
                    router.push({
                      pathname: '/(protected)/order/item-detail',
                      params: { menuId: String(menuId), sizeId: String(sizeId) }
                    })
                  }}
                  onRemove={(menuId, sizeId) => removeItem(menuId, sizeId)}
                />
              )
            })}

            {/* Total Summary */}
            <View
              className='mt-2 rounded-2xl border p-5'
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2
              }}
            >
              <View
                className='mb-3 flex-row items-center justify-between border-b pb-3'
                style={{ borderBottomColor: colors.border }}
              >
                <View className='flex-row items-center'>
                  <Ionicons name='receipt-outline' size={20} color={colors.textSecondary} />
                  <Text className='ml-2 text-base font-semibold' style={{ color: colors.text }}>
                    Tổng kết
                  </Text>
                </View>
              </View>

              <View className='mb-2 flex-row items-center justify-between'>
                <Text className='text-base' style={{ color: colors.textSecondary }}>
                  Tổng số lượng
                </Text>
                <Text className='text-base font-semibold' style={{ color: colors.text }}>
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>

              <View
                className='flex-row items-center justify-between border-t pt-2'
                style={{ borderTopColor: colors.border }}
              >
                <Text className='text-xl font-bold' style={{ color: colors.text }}>
                  Tổng tiền
                </Text>
                <Text className='text-2xl font-bold' style={{ color: colors.primary }}>
                  {formatCurrencyVND(totalPrice)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Create Order Button */}
      {orderItems.length > 0 && (
        <View
          className='mb-5 border-t-2 px-5 py-4'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 5
          }}
        >
          <TouchableOpacity
            className='flex-row items-center justify-center rounded-2xl py-4'
            style={{
              backgroundColor:
                createOrderMutation.isPending || addItemsMutation.isPending ? `${colors.primary}60` : colors.primary,
              opacity: createOrderMutation.isPending || addItemsMutation.isPending ? 0.8 : 1
            }}
            activeOpacity={0.8}
            disabled={createOrderMutation.isPending || addItemsMutation.isPending}
            onPress={() => {
              Alert.alert(
                'Xác nhận',
                modeValue === ORDER_FLOW_MODE.CREATE
                  ? 'Bạn muốn tạo đơn hàng này?'
                  : 'Bạn muốn thêm món vào đơn hàng này?',
                [
                  { text: 'Không', style: 'destructive' },
                  { text: 'Đồng ý', onPress: handleSubmit }
                ]
              )
            }}
          >
            {createOrderMutation.isPending || addItemsMutation.isPending ? (
              <ActivityIndicator color='white' size='small' />
            ) : (
              <>
                <Ionicons name='checkmark-circle-outline' size={24} color='white' />
                <Text className='ml-2 text-center text-lg font-bold text-white'>
                  {modeValue === ORDER_FLOW_MODE.CREATE ? 'Tạo đơn hàng' : 'Thêm món'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
