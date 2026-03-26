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
        className='flex-row items-center p-4 rounded-xl border-2 mx-6 mb-3'
        style={{
          backgroundColor: isSelected ? `${method.bgColor}` : colors.card,
          borderColor: isSelected ? method.iconColor : colors.border
        }}
        activeOpacity={0.7}
      >
        <View className='w-12 h-12 rounded-lg items-center justify-center' style={{ backgroundColor: method.bgColor }}>
          {method.logo ? (
            <method.logo width={24} height={24} />
          ) : (
            <Ionicons name={method.icon as any} size={24} color={method.iconColor} />
          )}
        </View>

        <Text className='flex-1 ml-4 font-bold text-base' style={{ color: colors.text }}>
          {method.label}
        </Text>

        <View
          className='w-6 h-6 rounded-full border-2 items-center justify-center'
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
      <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className='w-11/12 rounded-2xl overflow-hidden' style={{ backgroundColor: colors.background }}>
          {/* Header */}
          <View className='px-6 py-5 border-b' style={{ borderColor: colors.border }}>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center flex-1'>
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
          <View className='px-6 py-4 border-b' style={{ borderColor: colors.border }}>
            <Text className='text-sm' style={{ color: colors.textSecondary }}>
              Tổng tiền cần thanh toán
            </Text>
            <Text className='text-2xl font-bold mt-1' style={{ color: colors.primary }}>
              {totalAmount.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {/* Payment Methods */}
          <View className='py-4'>{PAYMENT_METHODS.map(renderPaymentMethod)}</View>

          {/* Footer */}
          <View className='px-6 py-4 border-t flex-row gap-3' style={{ borderColor: colors.border }}>
            <TouchableOpacity
              onPress={handleClose}
              className='flex-1 py-3 rounded-lg border items-center'
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
              className='flex-1 py-3 rounded-lg items-center'
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
