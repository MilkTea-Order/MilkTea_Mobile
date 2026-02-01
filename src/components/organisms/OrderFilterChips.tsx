import {
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_OPTIONS,
  type OrderStatus
} from '@/shared/constants/status'
import { Ionicons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

type Props = {
  selected: OrderStatus
  onChange: (v: OrderStatus) => void
  colors: any
}

type ChipOption = {
  value: OrderStatus
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

export const OrderFilterChips = ({ selected, onChange, colors }: Props) => {
  const options: ChipOption[] = useMemo(
    () =>
      ORDER_STATUS_OPTIONS.map((o) => ({
        value: o.value as OrderStatus,
        label: ORDER_STATUS_LABEL[o.value as OrderStatus],
        icon: ORDER_STATUS_ICON[o.value as OrderStatus] as keyof typeof Ionicons.glyphMap
      })),
    []
  )

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 8 }}>
      {options.map((opt) => {
        const isActive = selected === opt.value

        return (
          <TouchableOpacity
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            className='flex-row items-center rounded-full px-5 py-2.5'
            style={{
              backgroundColor: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
              borderWidth: isActive ? 0 : 1.5,
              borderColor: 'rgba(255,255,255,0.4)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isActive ? 0.15 : 0.08,
              shadowRadius: 4,
              elevation: isActive ? 4 : 2
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={opt.icon} size={18} color={isActive ? colors.primary : 'white'} />
            <Text className='ml-2 font-bold' style={{ color: isActive ? colors.primary : 'white' }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}
