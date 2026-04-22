import { useTheme } from '@/shared/hooks/useTheme'
import { PAYMENT_METHODS, PaymentMethod } from '@/shared/constants/payment'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export interface PaymentMethodFilterProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
  statics?: {
    totalAmountCash?: number
    totalAmountBank?: number
    totalAmountShopee?: number
    totalAmountGrab?: number
  }
}

export function PaymentMethodFilter({ selected, onChange, statics }: PaymentMethodFilterProps) {
  const { colors } = useTheme()

  const valueMap = {
    CASH: statics?.totalAmountCash ?? 0,
    BANK: statics?.totalAmountBank ?? 0,
    SHOPEE: statics?.totalAmountShopee ?? 0,
    GRAB: statics?.totalAmountGrab ?? 0
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12
      }}
    >
      {PAYMENT_METHODS.map((method) => {
        const value = valueMap[method.id]
        const isActive = selected === method.id

        return (
          <TouchableOpacity
            key={method.id}
            className='flex items-center px-2 py-1'
            activeOpacity={0.8}
            onPress={() => onChange(method.id)}
            style={{
              width: '23%',
              alignItems: 'center',
              borderRadius: 14,
              backgroundColor: isActive ? method.iconColor : `${method.iconColor}10`,
              borderWidth: 1,
              borderColor: isActive ? method.iconColor : `${method.iconColor}30`
            }}
          >
            {/* ICON */}
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${method.iconColor}20`
              }}
            >
              {method.logo ? (
                <method.logo width={20} height={20} />
              ) : (
                <Ionicons name={method.icon as any} size={18} color={isActive ? '#fff' : method.iconColor} />
              )}
            </View>

            {/* VALUE */}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isActive ? '#fff' : method.iconColor
              }}
            >
              {formatCurrencyVND(value)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
