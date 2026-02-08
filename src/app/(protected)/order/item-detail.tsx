import { Header } from '@/components/layouts/Header'
import { useUpdateOrderItem } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { ORDER_FLOW_MODE } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Toast } from 'react-native-toast-notifications'

type InitialItemSnapshot = {
  quantity: number
  note: string | null
}

export default function OrderItemDetailScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { menuId, sizeId } = useLocalSearchParams<{
    menuId?: string
    sizeId?: string
  }>()

  const menuIdNumber = useMemo(() => Number(menuId), [menuId])
  const sizeIdNumber = useMemo(() => Number(sizeId), [sizeId])

  const mode = useOrderStore((s) => s.mode)
  const isUpdateMode = mode === ORDER_FLOW_MODE.UPDATE_ITEMS
  const orderIdNumber = useOrderStore((s) => s.targetOrderId) ?? NaN
  const orderDetailIdNumber = useOrderStore((s) => s.editingOrderDetailId) ?? NaN

  const orderItems = useOrderStore((s) => s.items)
  const increment = useOrderStore((s) => s.increment)
  const decrement = useOrderStore((s) => s.decrement)
  const setLineNote = useOrderStore((s) => s.setLineNote)

  const menuItem = useMemo(() => {
    if (!Number.isFinite(menuIdNumber) || !Number.isFinite(sizeIdNumber)) return null
    return orderItems.find((x) => x.menuId === menuIdNumber && x.sizeId === sizeIdNumber) ?? null
  }, [orderItems, menuIdNumber, sizeIdNumber])

  const [initialItem, setInitialItem] = useState<InitialItemSnapshot | null>(null)
  const [noteDraft, setNoteDraft] = useState('')

  if (menuItem && !initialItem) {
    setInitialItem({
      quantity: menuItem.quantity,
      note: menuItem.note ?? null
    })
    setNoteDraft(menuItem.note ?? '')
  }

  const normalizedNote = useMemo(() => {
    const t = noteDraft.trim()
    return t.length ? t : null
  }, [noteDraft])

  const hasChanged = useMemo(() => {
    if (!menuItem || !initialItem) return false
    return menuItem.quantity !== initialItem.quantity || normalizedNote !== initialItem.note
  }, [menuItem, initialItem, normalizedNote])

  const hasValidUpdateIds = isUpdateMode && Number.isFinite(orderIdNumber) && Number.isFinite(orderDetailIdNumber)

  const updateMutation = useUpdateOrderItem(orderIdNumber, orderDetailIdNumber, {
    onSuccess: () => {
      Toast.show('Cập nhật món thành công', { type: 'success' })
      useOrderStore.getState().clear()
      router.back()
    }
  })

  const isSaving = isUpdateMode && updateMutation.isPending
  useFocusEffect(
    useCallback(() => {
      const item = useOrderStore.getState().items.find((x) => x.menuId === menuIdNumber && x.sizeId === sizeIdNumber)

      if (!item) {
        Alert.alert('Lỗi', 'Món không còn trong giỏ hàng', [{ text: 'OK', onPress: () => router.back() }])
      }
    }, [menuIdNumber, sizeIdNumber, router])
  )

  if (!menuItem) return null

  // ===== HANDLERS =====
  const handleBack = () => {
    if (isUpdateMode) {
      useOrderStore.getState().clear()
    }
    router.back()
  }

  const handleSubmit = () => {
    if (isSaving) return

    if (isUpdateMode) {
      if (!hasValidUpdateIds) {
        Alert.alert('Lỗi', 'Thiếu thông tin cập nhật.')
        return
      }

      Alert.alert('Xác nhận', 'Cập nhật món này?', [
        { text: 'Huỷ', style: 'destructive' },
        {
          text: 'Cập nhật',
          style: 'default',
          onPress: () => {
            updateMutation.mutate({
              quantity: menuItem.quantity,
              note: normalizedNote
            })
          }
        }
      ])
      return
    }

    setLineNote(menuItem.menuId, menuItem.sizeId, normalizedNote)
    router.back()
  }

  const disableSubmit = isSaving || !hasChanged || (isUpdateMode && !hasValidUpdateIds)

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Chi tiết món' onBack={handleBack} />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {/* Item info */}
        <View
          className='rounded-2xl p-4 border mb-4'
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className='flex-row items-center'>
            <View
              className='rounded-2xl items-center justify-center mr-12'
              style={{ width: 72, height: 72, backgroundColor: `${colors.primary}10` }}
            >
              <Ionicons name='restaurant-outline' size={36} color={colors.primary} />
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

        {/* Quantity */}
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
              style={{ borderWidth: 1.5, borderColor: colors.primary, paddingHorizontal: 10, paddingVertical: 6 }}
            >
              <TouchableOpacity
                onPress={() => decrement(menuItem.menuId, menuItem.sizeId)}
                disabled={isSaving}
                className='rounded-full'
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: menuItem.quantity <= 1 || isSaving ? 0.4 : 1
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='remove' size={18} color={colors.primary} />
              </TouchableOpacity>

              <Text className='text-base font-bold min-w-[36px] text-center' style={{ color: colors.text }}>
                {menuItem.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => increment(menuItem.menuId, menuItem.sizeId)}
                disabled={isSaving}
                className='rounded-full'
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSaving ? 0.4 : 1
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='add' size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View className='items-end'>
              <Text className='text-xs' style={{ color: colors.textSecondary }}>
                Thành tiền
              </Text>
              <Text className='text-lg font-bold' style={{ color: colors.primary }}>
                {formatCurrencyVND(menuItem.price * menuItem.quantity)}
              </Text>
            </View>
          </View>
        </View>

        {/* Note + Submit */}
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
              backgroundColor: colors.background,
              opacity: isSaving ? 0.7 : 1
            }}
          />
          <TouchableOpacity
            className='rounded-2xl py-4 mt-4 flex-row items-center justify-center'
            style={{ backgroundColor: colors.primary, opacity: disableSubmit ? 0.5 : 1 }}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={disableSubmit}
          >
            {isSaving ? (
              <ActivityIndicator />
            ) : (
              <Text className='text-white text-center text-base font-bold'>{isUpdateMode ? 'Cập nhật' : 'Lưu'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
