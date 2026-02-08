import { Header } from '@/components/layouts/Header'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useAddOrderItems, useCreateOrder } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { parseOrderError } from '@/features/order/utils/parseOrderError'
import { ORDER_FLOW_MODE } from '@/shared/constants/other'
import { STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { ApiErrorResponse } from '@/shared/types/api.type'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { isApiError } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Toast } from 'react-native-toast-notifications'

export default function ReviewCartScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const authProfile = useAuthStore((s) => s.profile)

  const orderItems = useOrderStore((s) => s.items)
  const orderIncrement = useOrderStore((s) => s.increment)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const removeItem = useOrderStore((s) => s.removeItem)
  const clearOrder = useOrderStore((s) => s.clear)
  const totalPrice = useOrderStore((s) => s.totalPrice)
  const mode = useOrderStore((s) => s.mode)
  const targetOrderId = useOrderStore((s) => s.targetOrderId)

  // const selectedTable = useOrderStore.getState().table
  const selectedTable = useOrderStore((s) => s.table)

  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  const createOrderMutation = useCreateOrder()

  const addItemsMutation = useAddOrderItems(targetOrderId ?? 0, {
    onSuccess: () => {
      Toast.show('Thêm món thành công', { type: 'success' })
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
      Alert.alert('Xác nhận', 'Bạn có muốn xóa món này khỏi giỏ hàng?', [
        { text: 'Huỷ', style: 'cancel' },
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

    if (mode === ORDER_FLOW_MODE.ADD_ITEMS) {
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
        if (isApiError(error)) {
          const result = parseOrderError(error as ApiErrorResponse)
          Alert.alert('Lỗi', result.message)
          router.replace('/(protected)/(tabs)')
        }
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
      <Header title={`Các món đã đặt •  ${selectedTable?.name ?? ''}`} onBack={handleBack} />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {/* Cart Items */}
        {orderItems.length === 0 ? (
          <View className='items-center py-16'>
            <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
              <Ionicons name='cart-outline' size={64} color={colors.primary} />
            </View>
            <Text className='text-xl font-bold mb-2' style={{ color: colors.text }}>
              Giỏ hàng trống
            </Text>
            <Text className='text-sm text-center mb-6' style={{ color: colors.textSecondary }}>
              Hãy thêm món vào giỏ hàng để tiếp tục
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className='px-8 py-3 rounded-xl'
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}
            >
              <Text className='text-white font-semibold text-base'>Tiếp tục mua hàng</Text>
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
              const hasError = !!itemErrors[`${item.menuId}-${item.sizeId}`]
              return (
                <View
                  key={`${item.menuId}-${item.sizeId}`}
                  className='rounded-2xl p-3 mb-3 border'
                  style={{
                    backgroundColor: colors.card,
                    borderColor: hasError ? colors.error : colors.border,
                    borderWidth: hasError ? 2 : 1
                  }}
                >
                  <View className='flex-row items-center justify-between'>
                    <View
                      className='rounded-xl mr-3 overflow-hidden items-center justify-center'
                      style={{ width: 52, height: 52, backgroundColor: `${colors.primary}10` }}
                    >
                      {(item as any).MenuImage ? (
                        <Image
                          source={{ uri: (item as any).MenuImage }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode='cover'
                        />
                      ) : (
                        <Ionicons name='restaurant-outline' size={28} color={colors.primary} />
                      )}
                    </View>

                    <View className='flex-1 mr-3'>
                      <View className='flex-row items-center mt-2'>
                        <Text className='text-lg font-bold mr-2' style={{ color: colors.text }} numberOfLines={2}>
                          {item.menuName}
                        </Text>
                        <View className='px-2 py-1 rounded' style={{ backgroundColor: `${colors.primary}15` }}>
                          <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                            {item.sizeName}
                          </Text>
                        </View>
                      </View>

                      {item.note ? (
                        <View className='mt-1 flex-row items-start' style={{ gap: 6 }}>
                          <Ionicons name='chatbubble-ellipses-outline' size={14} color={colors.textSecondary} />
                          <Text className='flex-1 text-xs' style={{ color: colors.textSecondary }} numberOfLines={2}>
                            {item.note}
                          </Text>
                        </View>
                      ) : null}

                      <View className='flex-row items-center mt-1'>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            router.push({
                              pathname: '/(protected)/order/item-detail',
                              params: { menuId: String(item.menuId), sizeId: String(item.sizeId) }
                            })
                          }
                        >
                          <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                            Chỉnh sửa
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {itemErrors[`${item.menuId}-${item.sizeId}`] ? (
                        <View className='mt-1 flex-row items-center'>
                          <Ionicons name='alert-circle' size={14} color={colors.error} />
                          <Text className='ml-1.5 text-xs' style={{ color: colors.error }}>
                            {itemErrors[`${item.menuId}-${item.sizeId}`]}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View className='items-end'>
                      <Text className='text-sm font-bold' style={{ color: colors.textSecondary }}>
                        {formatCurrencyVND(item.price * item.quantity)}
                      </Text>

                      <View
                        className='flex-row items-center rounded-full mt-2'
                        style={{
                          borderWidth: 1.5,
                          borderColor: colors.primary,
                          paddingHorizontal: 6,
                          paddingVertical: 4
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleDecrement(item.menuId, item.sizeId)}
                          className='rounded-full'
                          style={{
                            width: 26,
                            height: 26,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name='remove' size={16} color={colors.primary} />
                        </TouchableOpacity>

                        <Text className='text-sm font-bold min-w-[24px] text-center' style={{ color: colors.text }}>
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          onPress={() => orderIncrement(item.menuId, item.sizeId)}
                          className='rounded-full'
                          style={{
                            width: 26,
                            height: 26,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name='add' size={16} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            {/* Total Summary */}
            <View
              className='rounded-2xl p-5 border mt-2'
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
                className='flex-row items-center justify-between mb-3 pb-3 border-b'
                style={{ borderBottomColor: colors.border }}
              >
                <View className='flex-row items-center'>
                  <Ionicons name='receipt-outline' size={20} color={colors.textSecondary} />
                  <Text className='text-base font-semibold ml-2' style={{ color: colors.text }}>
                    Tổng kết
                  </Text>
                </View>
              </View>

              <View className='flex-row items-center justify-between mb-2'>
                <Text className='text-base' style={{ color: colors.textSecondary }}>
                  Tổng số lượng
                </Text>
                <Text className='text-base font-semibold' style={{ color: colors.text }}>
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)} Món
                </Text>
              </View>

              <View
                className='flex-row items-center justify-between pt-2 border-t'
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
          className='border-t-2 px-5 py-4'
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
            className='rounded-2xl py-4 flex-row items-center justify-center'
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
                mode === ORDER_FLOW_MODE.CREATE
                  ? 'Bạn chắc chắn muốn tạo đơn hàng này?'
                  : 'Bạn chắc chắn muốn cập nhật đơn hàng này?',
                [
                  { text: 'Huỷ', style: 'destructive' },
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
                <Text className='text-white text-center text-lg font-bold ml-2'>
                  {mode === ORDER_FLOW_MODE.CREATE ? 'Tạo đơn hàng' : 'Cập nhật đơn hàng'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
