import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { FinanceItemRow } from '@/components/molecules/FinanceItemRow'
import { FinanceGroupReport } from '@/features/report/types/finance.type'
import { FINANCE_GROUP_ID } from '@/shared/constants/finance'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'

import React from 'react'
import { FlatList, Text, View } from 'react-native'

const COLOR_NEGATIVE = '#ef4444'
const COLOR_POSITIVE = '#22c55e'

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}

interface FinanceGroupSectionProps {
  group: FinanceGroupReport
}

export function FinanceGroupSection({ group }: FinanceGroupSectionProps) {
  const { colors } = useTheme()
  const color = getAmountColor(group.totalAmount)

  return (
    <CollapsibleSection
      icon={group.totalAmount < 0 ? 'arrow-down-circle' : 'arrow-up-circle'}
      headerContent={
        <View className='flex-1 flex-row items-center'>
          <View className='flex-1'>
            <Text className='text-base font-bold' style={{ color: colors.text }}>
              {group.name}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {group.items.length} biến động
            </Text>
          </View>
          <Text className='mr-2 text-base font-bold' style={{ color }}>
            {formatCurrencyVND(group.totalAmount)}
          </Text>
        </View>
      }
    >
      <FlatList
        data={group.items}
        scrollEnabled={false}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item, index }) => (
          <FinanceItemRow
            item={item}
            isLast={index === group.items.length - 1}
            amount={group.totalAmount}
            isCollected={group.id === FINANCE_GROUP_ID.COLLECTED}
          />
        )}
      />
    </CollapsibleSection>
  )
}
