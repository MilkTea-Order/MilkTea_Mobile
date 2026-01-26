import { Header } from '@/components/layouts/Header'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useCreateOrder } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { parseCreateOrderError } from '@/features/order/utils/parseCreateOrderError'
import { useTheme } from '@/shared/hooks/useTheme'
import { ApiErrorResponse } from '@/shared/types/api.type'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { isApiError } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
export default function ReviewCartScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const authProfile = useAuthStore((s) => s.profile)
  const orderItems = useOrderStore((s) => s.items)
  const orderIncrement = useOrderStore((s) => s.increment)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const clearOrder = useOrderStore((s) => s.clear)
  const totalPrice = useOrderStore((s) => s.totalPrice)
  const selectedTable = useOrderStore((s) => s.table)

  const createOrderMutation = useCreateOrder()
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  // Nếu không có table trong store thì redirect về chọn bàn
  useEffect(() => {
    if (!selectedTable) {
      router.replace('/(protected)/order/select-table')
    }
  }, [router, selectedTable])

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = () => {
    if (!selectedTable) return
    if (!orderItems.length) return

    setItemErrors({})

    const userId = Number(authProfile?.user?.id ?? 0)
    const payload = {
      dinnerTableID: selectedTable.tableID,
      orderByID: userId || 0,
      items: orderItems.map((item) => ({
        menuID: item.menuId,
        sizeID: item.sizeId,
        quantity: item.quantity,
        toppingIDs: [],
        kindOfHotpotIDs: [],
        note: null
      })),
      note: null
    }

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        clearOrder()
        router.replace('/(protected)/(tabs)')
      },
      onError: (error) => {
        if (isApiError(error)) {
          const result = parseCreateOrderError(error as ApiErrorResponse)
          if (result.type === 'item') {
            setItemErrors({ [`${result.menuId}-${result.sizeId}`]: result.message })
            Alert.alert('Lỗi', result.message)
            return
          }
          Alert.alert('Lỗi', result.message)
          router.replace('/(protected)/(tabs)')
        }
        Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.')
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
      <Header title='Giỏ hàng' onBack={handleBack} />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {/* Table Info */}
        {selectedTable && (
          <View
            className='p-4 rounded-2xl border mb-4'
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
            <View className='flex-row items-center'>
              <View className='rounded-full p-3' style={{ backgroundColor: `${colors.primary}15` }}>
                <Ionicons name='restaurant-outline' size={24} color={colors.primary} />
              </View>
              <View className='ml-3 flex-1'>
                <Text className='text-lg font-bold mb-1' style={{ color: colors.text }}>
                  {selectedTable.tableName}
                </Text>
                <View className='flex-row items-center'>
                  <Ionicons name='people-outline' size={16} color={colors.textSecondary} />
                  <Text className='text-sm ml-1' style={{ color: colors.textSecondary }}>
                    {selectedTable.numberOfSeat} ghế
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

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
            <View className='mb-4'>
              <Text className='text-2xl font-bold mb-1' style={{ color: colors.text }}>
                Đơn hàng của bạn
              </Text>
              <Text className='text-sm' style={{ color: colors.textSecondary }}>
                {orderItems.length} món • {orderItems.reduce((sum, item) => sum + item.quantity, 0)} phần
              </Text>
            </View>

            {orderItems.map((item) => {
              const hasError = !!itemErrors[`${item.menuId}-${item.sizeId}`]
              return (
                <View
                  key={`${item.menuId}-${item.sizeId}`}
                  className='rounded-2xl p-4 mb-3 border overflow-hidden'
                  style={{
                    backgroundColor: colors.card,
                    borderColor: hasError ? colors.error : colors.border,
                    borderWidth: hasError ? 2 : 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                  }}
                >
                  <View className='flex-row items-start justify-between mb-3'>
                    <View className='flex-1 mr-3'>
                      <Text className='text-lg font-bold mb-1' style={{ color: colors.text }}>
                        {item.menuName}
                      </Text>
                      <View className='flex-row items-center mt-1'>
                        <View className='px-2 py-0.5 rounded' style={{ backgroundColor: `${colors.primary}15` }}>
                          <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                            {item.sizeName}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className='items-end'>
                      <Text className='text-base font-bold mb-1' style={{ color: colors.primary }}>
                        {formatCurrencyVND(item.price)}
                      </Text>
                      <Text className='text-xs' style={{ color: colors.textSecondary }}>
                        / phần
                      </Text>
                    </View>
                  </View>

                  <View
                    className='flex-row items-center justify-between pt-3 border-t'
                    style={{ borderTopColor: colors.border }}
                  >
                    <View className='flex-row items-center'>
                      <TouchableOpacity
                        onPress={() => orderDecrement(item.menuId, item.sizeId)}
                        className='rounded-full p-2'
                        style={{ backgroundColor: `${colors.primary}20` }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name='remove' size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <Text className='text-lg font-bold mx-4 min-w-[32px] text-center' style={{ color: colors.text }}>
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => orderIncrement(item.menuId, item.sizeId)}
                        className='rounded-full p-2'
                        style={{ backgroundColor: `${colors.primary}20` }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name='add' size={18} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <View className='items-end'>
                      <Text className='text-lg font-bold' style={{ color: colors.primary }}>
                        {formatCurrencyVND(item.price * item.quantity)}
                      </Text>
                      <Text className='text-xs' style={{ color: colors.textSecondary }}>
                        Tổng
                      </Text>
                    </View>
                  </View>

                  {itemErrors[`${item.menuId}-${item.sizeId}`] ? (
                    <View className='mt-2 flex-row items-center'>
                      <Ionicons name='alert-circle' size={14} color={colors.error} />
                      <Text className='ml-1.5 text-sm' style={{ color: colors.error }}>
                        {itemErrors[`${item.menuId}-${item.sizeId}`]}
                      </Text>
                    </View>
                  ) : null}
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
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)} phần
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
              backgroundColor: createOrderMutation.isPending ? `${colors.primary}60` : colors.primary,
              opacity: createOrderMutation.isPending ? 0.8 : 1
            }}
            activeOpacity={0.8}
            disabled={createOrderMutation.isPending}
            onPress={handleSubmit}
          >
            {createOrderMutation.isPending ? (
              <ActivityIndicator color='white' size='small' />
            ) : (
              <>
                <Ionicons name='checkmark-circle-outline' size={24} color='white' />
                <Text className='text-white text-center text-lg font-bold ml-2'>Tạo đơn hàng</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
