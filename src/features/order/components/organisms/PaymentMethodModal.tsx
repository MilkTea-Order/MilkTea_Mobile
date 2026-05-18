import { PAYMENT_METHODS, PaymentMethod, PaymentMethodOption } from '@/shared/constants/payment'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

interface PaymentMethodModalProps {
  visible: boolean
  totalAmount: number
  isSubmitting?: boolean
  onSelect: (paymentMethod: PaymentMethod) => void
  onClose: () => void
  colors: {
    primary: string
    error: string
    text: string
    textSecondary: string
    background: string
    border: string
    card: string
  }
}

export function PaymentMethodModal({
  visible,
  totalAmount,
  isSubmitting = false,
  onSelect,
  onClose,
  colors
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null)

  const handleConfirm = () => {
    if (selectedMethod) {
      onSelect(selectedMethod as PaymentMethod)
      setSelectedMethod(null)
    }
  }

  const handleClose = () => {
    setSelectedMethod(null)
    onClose()
  }

  const renderPaymentMethod = (method: PaymentMethodOption) => {
    const isSelected = selectedMethod === method.id

    return (
      <TouchableOpacity
        key={method.id}
        onPress={() => setSelectedMethod(method.id)}
        className='mx-6 mb-3 flex-row items-center rounded-xl border-2 p-4'
        style={{
          backgroundColor: isSelected ? `${method.bgColor}` : colors.card,
          borderColor: isSelected ? method.iconColor : colors.border
        }}
        activeOpacity={0.7}
      >
        <View className='h-12 w-12 items-center justify-center rounded-lg' style={{ backgroundColor: method.bgColor }}>
          {method.logo ? (
            <method.logo width={24} height={24} />
          ) : (
            <Ionicons name={method.icon as any} size={24} color={method.iconColor} />
          )}
        </View>

        <Text className='ml-4 flex-1 text-base font-bold' style={{ color: colors.text }}>
          {method.label}
        </Text>

        <View
          className='h-6 w-6 items-center justify-center rounded-full border-2'
          style={{
            borderColor: isSelected ? method.iconColor : colors.border,
            backgroundColor: isSelected ? method.iconColor : 'transparent'
          }}
        >
          {isSelected && <Ionicons name='checkmark' size={14} color='white' />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View className='flex-1 items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className='w-11/12 overflow-hidden rounded-2xl' style={{ backgroundColor: colors.background }}>
          {/* Header */}
          <View className='border-b px-6 py-5' style={{ borderColor: colors.border }}>
            <View className='flex-row items-center justify-between'>
              <View className='flex-1 flex-row items-center'>
                <Ionicons name='card-outline' size={24} color={colors.primary} />
                <Text className='ml-3 text-lg font-bold' style={{ color: colors.text }}>
                  Phương thức thanh toán
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name='close' size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Amount */}
          <View className='border-b px-6 py-4' style={{ borderColor: colors.border }}>
            <Text className='text-sm' style={{ color: colors.textSecondary }}>
              Tổng tiền cần thanh toán
            </Text>
            <Text className='mt-1 text-2xl font-bold' style={{ color: colors.primary }}>
              {totalAmount.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {/* Payment Methods */}
          <View className='py-4'>{PAYMENT_METHODS.map(renderPaymentMethod)}</View>

          {/* Footer */}
          <View className='flex-row gap-3 border-t px-6 py-4' style={{ borderColor: colors.border }}>
            <TouchableOpacity
              onPress={handleClose}
              className='flex-1 items-center rounded-lg border py-3'
              style={{ borderColor: colors.border }}
              activeOpacity={0.7}
            >
              <Text className='font-semibold' style={{ color: colors.text }}>
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedMethod || isSubmitting}
              className='flex-1 items-center rounded-lg py-3'
              style={{
                backgroundColor: selectedMethod && !isSubmitting ? colors.primary : `${colors.primary}30`,
                opacity: selectedMethod && !isSubmitting ? 1 : 0.5
              }}
              activeOpacity={0.7}
            >
              <Text
                className='font-semibold'
                style={{ color: selectedMethod && !isSubmitting ? 'white' : colors.text }}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
