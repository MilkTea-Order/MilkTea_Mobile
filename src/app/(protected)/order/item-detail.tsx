import { Header } from '@/components/layouts/Header'
import { useUpdateOrderItem } from '@/features/order/hooks/useOrder'
import { useOrderStore } from '@/features/order/store/order.store'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Toast } from 'react-native-toast-notifications'

type InitialItemSnapshot = {
  quantity: number
  note: string | null
}

export default function OrderItemDetailScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { menuId, sizeId, orderId, orderDetailId, isUpdate } = useLocalSearchParams<{
    menuId?: string
    sizeId?: string
    orderId?: string
    orderDetailId?: string
    isUpdate?: 'true' | 'false'
  }>()

  const hasNavigatedRef = React.useRef(false)

  // Params -> number
  const menuIdNumber = useMemo(() => (menuId ? Number(menuId) : NaN), [menuId])
  const sizeIdNumber = useMemo(() => (sizeId ? Number(sizeId) : NaN), [sizeId])

  // Update mode
  const orderIdNumber = useMemo(() => (orderId ? Number(orderId) : NaN), [orderId])
  const orderDetailIdNumber = useMemo(() => (orderDetailId ? Number(orderDetailId) : NaN), [orderDetailId])
  const isUpdateMode = useMemo(() => isUpdate === 'true', [isUpdate])

  // Store
  const orderItems = useOrderStore((s) => s.items)
  const increment = useOrderStore((s) => s.increment)
  const decrement = useOrderStore((s) => s.decrement)
  const setLineNote = useOrderStore((s) => s.setLineNote)

  // Find current item in store
  const menuItem = useMemo(() => {
    if (!Number.isFinite(menuIdNumber) || !Number.isFinite(sizeIdNumber)) return null
    return orderItems.find((x) => x.menuId === menuIdNumber && x.sizeId === sizeIdNumber) ?? null
  }, [menuIdNumber, sizeIdNumber, orderItems])

  // Freeze initial snapshot (không dùng ref)
  const [initialItem, setInitialItem] = useState<InitialItemSnapshot | null>(null)

  // Note draft
  const [noteDraft, setNoteDraft] = useState('')

  // Set initial snapshot + note draft đúng 1 lần khi menuItem xuất hiện
  useEffect(() => {
    if (!menuItem) return
    if (initialItem) return

    const init: InitialItemSnapshot = {
      quantity: menuItem.quantity,
      note: menuItem.note ?? null
    }

    setInitialItem(init)
    setNoteDraft(init.note ?? '')
  }, [menuItem, initialItem])

  const normalizedNote = useMemo(() => {
    const t = noteDraft.trim()
    return t.length ? t : null
  }, [noteDraft])

  const hasChanged = useMemo(() => {
    if (!menuItem || !initialItem) return false
    return menuItem.quantity !== initialItem.quantity || normalizedNote !== initialItem.note
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItem?.quantity, normalizedNote, initialItem])

  const hasValidUpdateIds = useMemo(() => {
    if (!isUpdateMode) return false
    return Number.isFinite(orderIdNumber) && Number.isFinite(orderDetailIdNumber)
  }, [isUpdateMode, orderIdNumber, orderDetailIdNumber])

  const updateMutation = useUpdateOrderItem(orderIdNumber, orderDetailIdNumber, {
    onSuccess: () => {
      hasNavigatedRef.current = true
      Toast.show('Cập nhật món thành công', { type: 'success' })
      useOrderStore.getState().clear()
      router.back()
    }
  })

  // If item disappears from store, navigate back with alert
  useEffect(() => {
    if (menuItem || hasNavigatedRef.current) return
    if (!Number.isFinite(menuIdNumber) || !Number.isFinite(sizeIdNumber)) return

    Alert.alert('Lỗi', 'Món không còn trong giỏ hàng', [{ text: 'OK', onPress: () => router.back() }])
  }, [menuItem, menuIdNumber, sizeIdNumber, router])

  if (!menuItem) return null

  const isSaving = isUpdateMode ? updateMutation.isPending : false

  const handleBack = () => {
    if (isUpdateMode) {
      useOrderStore.getState().clear()
    }
    hasNavigatedRef.current = true
    router.back()
  }

  const handleSubmit = () => {
    if (isSaving) return

    if (isUpdateMode) {
      if (!hasValidUpdateIds) {
        Alert.alert('Lỗi', 'Thiếu thông tin để cập nhật món.')
        return
      }

      Alert.alert('Xác nhận cập nhật', 'Bạn có chắc chắn muốn cập nhật món này không?', [
        {
          text: 'Cập nhật',
          style: 'destructive',
          onPress: () => {
            updateMutation.mutate({
              quantity: menuItem.quantity,
              note: normalizedNote
            })
          }
        },
        { text: 'Huỷ', style: 'cancel' }
      ])

      return
    }

    // Create / Save mode
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
                disabled={menuItem.quantity <= 1 || isSaving}
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
          {/* Helper text
          {isUpdateMode && !hasValidUpdateIds ? (
            <Text className='mt-2 text-xs' style={{ color: colors.textSecondary }}>
              Không thể cập nhật vì orderId/orderDetailId không hợp lệ.
            </Text>
          ) : !hasChanged ? (
            <Text className='mt-2 text-xs' style={{ color: colors.textSecondary }}>
              Bạn chưa thay đổi số lượng hoặc ghi chú.
            </Text>
          ) : null} */}
        </View>
      </ScrollView>
    </View>
  )
}
