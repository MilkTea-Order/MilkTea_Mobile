import { ActionButton } from '@/components/atoms/ActionButton'
import { useTheme } from '@/shared/hooks/useTheme'
import React from 'react'
import { View } from 'react-native'

interface OrderActionPanelProps {
  filterMode: 'placed' | 'cancelled'
  onFilterToggle: () => void
  colors: ReturnType<typeof useTheme>['colors']
}

export function OrderActionPanel({ filterMode, onFilterToggle, colors }: OrderActionPanelProps) {
  return (
    <View
      className='rounded-3xl p-3 mb-4 border'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border
      }}
    >
      <View className='flex-row gap-2'>
        <ActionButton
          label='Hủy bàn'
          icon='close-circle-outline'
          variant='danger'
          onPress={() => {
            // TODO: wire API/action
          }}
          colors={colors as any}
        />

        <ActionButton
          label='Gộp bàn'
          icon='git-merge-outline'
          onPress={() => {
            // TODO: wire navigation/action
          }}
          colors={colors as any}
        />
      </View>

      <View className='flex-row mt-2 gap-2'>
        <ActionButton
          label='Chuyển bàn'
          icon='swap-horizontal-outline'
          onPress={() => {
            // TODO: wire navigation/action
          }}
          colors={colors as any}
        />
        <ActionButton
          label='Thanh toán'
          icon='card-outline'
          variant='primary'
          onPress={() => {
            // TODO: wire payment flow
          }}
          colors={colors as any}
        />
      </View>

      <View className='flex-row mt-2'>
        <ActionButton
          label={filterMode === 'placed' ? 'Đã đặt' : 'Đã hủy'}
          icon='funnel-outline'
          onPress={onFilterToggle}
          colors={colors as any}
        />
      </View>
    </View>
  )
}
