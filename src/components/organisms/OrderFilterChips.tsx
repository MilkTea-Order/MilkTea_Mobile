import {
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_OPTIONS,
  type OrderStatus
} from '@/shared/constants/status'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'

type Props = {
  selected: OrderStatus
  onChange: (v: OrderStatus) => void
  colors: any
}

export const OrderFilterChips = ({ selected, onChange, colors }: Props) => {
  const listRef = useRef<FlatList>(null)

  const options = useMemo(
    () =>
      ORDER_STATUS_OPTIONS.map((o) => ({
        value: o.value as OrderStatus,
        label: ORDER_STATUS_LABEL[o.value as OrderStatus],
        icon: ORDER_STATUS_ICON[o.value as OrderStatus] as keyof typeof Ionicons.glyphMap
      })),
    []
  )

  useEffect(() => {
    const index = options.findIndex((o) => o.value === selected)
    if (index !== -1) {
      listRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true
      })
    }
  }, [selected, options])

  return (
    <FlatList
      ref={listRef}
      data={options}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.value)}
      contentContainerStyle={{ gap: 10, paddingRight: 8, marginBottom: 15 }}
      renderItem={({ item }) => {
        const isActive = selected === item.value

        return (
          <TouchableOpacity
            onPress={() => onChange(item.value)}
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
            <Ionicons name={item.icon} size={18} color={isActive ? colors.primary : 'white'} />

            <Text className='ml-2 font-bold' style={{ color: isActive ? colors.primary : 'white' }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      }}
      onScrollToIndexFailed={() => {
        setTimeout(() => {
          const index = options.findIndex((o) => o.value === selected)
          if (index !== -1) {
            listRef.current?.scrollToIndex({
              index,
              viewPosition: 0.5,
              animated: true
            })
          }
        }, 100)
      }}
    />
  )
}
