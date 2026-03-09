import { Header } from '@/components/layouts/Header'
import { useUpdateOrderItem } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { ORDER_FLOW_MODE, OrderFlowMode } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function OrderItemDetailScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { menuId, sizeId, mode, orderId, orderDetailId } = useLocalSearchParams<{
    menuId?: string
    sizeId?: string
    mode?: OrderFlowMode
    orderId?: string
    orderDetailId?: string
  }>()

  const menuIdNumber = Number(menuId)
  const sizeIdNumber = Number(sizeId)

  const modeValue = mode ?? ORDER_FLOW_MODE.CREATE
  const isUpdateMode = modeValue === ORDER_FLOW_MODE.UPDATE_ITEMS

  const orderIdNumber = Number(orderId)
  const orderDetailIdNumber = Number(orderDetailId)

  const hasValidUpdateIds = isUpdateMode && Number.isFinite(orderIdNumber) && Number.isFinite(orderDetailIdNumber)

  // ===== STORE =====
  const increment = useOrderStore((s) => s.increment)
  const decrement = useOrderStore((s) => s.decrement)
  const removeItem = useOrderStore((s) => s.removeItem)
  const setLineNote = useOrderStore((s) => s.setLineNote)

  // ===== ITEM =====
  const menuItem = useMemo(() => {
    const items = useOrderStore.getState().items
    if (!Number.isFinite(menuIdNumber) || !Number.isFinite(sizeIdNumber)) return null
    return items.find((x) => x.menuId === menuIdNumber && x.sizeId === sizeIdNumber) ?? null
  }, [menuIdNumber, sizeIdNumber])

  // ===== LOCAL STATE =====
  const [noteDraft, setNoteDraft] = useState('')
  const [quantityDraft, setQuantityDraft] = useState<number | null>(null)

  console.log('item-detail')
  useFocusEffect(
    useCallback(() => {
      if (!menuItem) {
        Alert.alert('Lỗi', 'Món không tồn tại trong giỏ hàng', [
          {
            text: 'OK',
            onPress: () => router.replace('/(protected)/(tabs)')
          }
        ])
        return
      }
      setNoteDraft(menuItem.note ?? '')
      setQuantityDraft(menuItem.quantity)
    }, [menuItem, router])
  )

  const displayQuantity = quantityDraft ?? menuItem?.quantity ?? 1

  const normalizedNote = useMemo(() => {
    const t = noteDraft.trim()
    return t.length ? t : null
  }, [noteDraft])

  const hasChanged = useMemo(() => {
    if (!menuItem) return false
    return displayQuantity !== menuItem.quantity || normalizedNote !== menuItem.note
  }, [menuItem, displayQuantity, normalizedNote])

  const updateMutation = useUpdateOrderItem(orderIdNumber, orderDetailIdNumber, {
    onSuccess: () => {
      router.back()
      useOrderStore.getState().clear()
      return
    }
  })

  const isSaving = isUpdateMode && updateMutation.isPending

  if (!menuItem) return null

  // ===== HANDLERS =====

  const handleBack = () => {
    if (isUpdateMode) {
      useOrderStore.getState().clear()
    }
    router.back()
  }

  const handleDecrement = () => {
    if (isSaving) return

    if (displayQuantity === 1) {
      Alert.alert(
        'Xác nhận',
        `Bạn muốn ${
          isUpdateMode ? `huỷ món ${menuItem.menuName} khỏi đơn hàng` : `xoá món ${menuItem.menuName} khỏi giỏ hàng`
        } ?`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: isUpdateMode ? 'Huỷ món' : 'Xoá món',
            style: 'destructive',
            onPress: () => {
              if (isUpdateMode) {
                if (!hasValidUpdateIds) {
                  Alert.alert('Lỗi', 'Thiếu thông tin cập nhật.')
                  return
                }

                updateMutation.mutate({
                  quantity: 0,
                  note: normalizedNote
                })
              } else {
                removeItem(menuItem.menuId, menuItem.sizeId)
                router.back()
              }
            }
          }
        ]
      )
      return
    }

    setQuantityDraft(displayQuantity - 1)
  }

  const handleIncrement = () => {
    if (isSaving) return
    setQuantityDraft(displayQuantity + 1)
  }

  const handleSubmit = () => {
    if (isSaving) return

    if (isUpdateMode) {
      if (!hasValidUpdateIds) {
        Alert.alert('Lỗi', 'Thiếu thông tin cập nhật.')
        return
      }

      Alert.alert('Xác nhận', 'Bạn muốn cập nhật thông tin món này?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Cập nhật',
          style: 'destructive',
          onPress: () => {
            updateMutation.mutate({
              quantity: displayQuantity,
              note: normalizedNote
            })
          }
        }
      ])
      return
    }

    const currentQuantity = menuItem.quantity
    const newQuantity = displayQuantity

    if (newQuantity > currentQuantity) {
      const diff = newQuantity - currentQuantity
      for (let i = 0; i < diff; i++) {
        increment(menuItem.menuId, menuItem.sizeId)
      }
    } else if (newQuantity < currentQuantity) {
      const diff = currentQuantity - newQuantity
      for (let i = 0; i < diff; i++) {
        decrement(menuItem.menuId, menuItem.sizeId)
      }
    }

    setLineNote(menuItem.menuId, menuItem.sizeId, normalizedNote)
    router.back()
  }

  const disableSubmit = isSaving || !hasChanged || (isUpdateMode && !hasValidUpdateIds)

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Chi tiết món' onBack={handleBack} />

      <ScrollView className='flex-1' contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* ITEM */}
        <View
          className='rounded-2xl p-4 border mb-4'
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className='flex-row items-center'>
            <View
              className='rounded-2xl items-center justify-center mr-12'
              style={{
                width: 72,
                height: 72,
                backgroundColor: `${colors.primary}10`
              }}
            >
              {menuItem.menuImage ? (
                <Image
                  source={{ uri: menuItem.menuImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='contain'
                />
              ) : (
                <Ionicons name='restaurant-outline' size={36} color={colors.primary} />
              )}
            </View>

            <View className='flex-1'>
              <View className='flex-row items-center mt-2'>
                <Text className='text-lg font-bold mr-3' style={{ color: colors.text }} numberOfLines={2}>
                  {menuItem.menuName}
                </Text>

                <View className='px-2 py-1 rounded' style={{ backgroundColor: `${colors.primary}15` }}>
                  <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                    {menuItem.sizeName}
                  </Text>
                </View>
              </View>

              <Text className='text-sm font-semibold mt-2' style={{ color: colors.textSecondary }}>
                {formatCurrencyVND(menuItem.price)} / món
              </Text>
            </View>
          </View>
        </View>

        {/* QUANTITY */}
        <View
          className='rounded-2xl p-4 border mb-4'
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <Text className='text-base font-bold mb-3' style={{ color: colors.text }}>
            Số lượng
          </Text>

          <View className='flex-row items-center justify-between'>
            <View
              className='flex-row items-center rounded-full'
              style={{
                borderWidth: 1.5,
                borderColor: colors.primary,
                paddingHorizontal: 10,
                paddingVertical: 6
              }}
            >
              <TouchableOpacity
                onPress={handleDecrement}
                disabled={isSaving}
                className='rounded-full'
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSaving ? 0.4 : 1
                }}
              >
                <Ionicons name='remove' size={18} color={colors.primary} />
              </TouchableOpacity>

              <Text className='text-base font-bold min-w-[36px] text-center' style={{ color: colors.text }}>
                {displayQuantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrement}
                disabled={isSaving}
                className='rounded-full'
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSaving ? 0.4 : 1
                }}
              >
                <Ionicons name='add' size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View className='items-end'>
              <Text className='text-xs' style={{ color: colors.textSecondary }}>
                Thành tiền
              </Text>

              <Text className='text-lg font-bold' style={{ color: colors.primary }}>
                {formatCurrencyVND(menuItem.price * displayQuantity)}
              </Text>
            </View>
          </View>
        </View>

        {/* NOTE */}
        <View className='rounded-2xl p-4 border' style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Text className='text-base font-bold mb-3' style={{ color: colors.text }}>
            Ghi chú
          </Text>

          <TextInput
            value={noteDraft}
            onChangeText={setNoteDraft}
            placeholder='Ví dụ: ít đá, ít đường...'
            placeholderTextColor={colors.textSecondary}
            multiline
            editable={!isSaving}
            style={{
              minHeight: 96,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: colors.text,
              backgroundColor: colors.background
            }}
          />

          <TouchableOpacity
            className='rounded-2xl py-4 mt-4 flex-row items-center justify-center'
            style={{
              backgroundColor: colors.primary,
              opacity: disableSubmit ? 0.5 : 1
            }}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={disableSubmit}
          >
            {isSaving ? (
              <ActivityIndicator />
            ) : (
              <Text className='text-white text-base font-bold'>{isUpdateMode ? 'Cập nhật' : 'Lưu'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
