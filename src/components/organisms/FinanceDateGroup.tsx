import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { FinanceGroupSection } from '@/components/organisms/FinanceGroupSection'
import { FinanceReport } from '@/features/report/types/finance.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDate } from '@/shared/utils/date.util'

import dayjs from 'dayjs'
import React from 'react'
import { FlatList, Text, View } from 'react-native'

const COLOR_NEGATIVE = '#ef4444'
const COLOR_POSITIVE = '#22c55e'

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}

interface FinanceDateGroupProps {
  dateGroup: FinanceReport
}

export function FinanceDateGroup({ dateGroup }: FinanceDateGroupProps) {
  const { colors } = useTheme()
  const color = getAmountColor(dateGroup.totalAmount)

  return (
    <CollapsibleSection
      icon={dateGroup.totalAmount < 0 ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='flex-1'>
            <Text className='text-sm font-bold' style={{ color: colors.text }}>
              {formatDate(dayjs(dateGroup.date), 'DD/MM/YYYY')}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {dateGroup.groups.reduce<number>((sum, g) => sum + g.items.length, 0)} biến động
            </Text>
          </View>
          <Text className='text-sm font-bold mr-2' style={{ color }}>
            {formatCurrencyVND(dateGroup.totalAmount)}
          </Text>
        </View>
      }
    >
      <FlatList
        data={dateGroup.groups}
        scrollEnabled={false}
        keyExtractor={(item) => `${dateGroup.date}-${item.id}`}
        renderItem={({ item }) => <FinanceGroupSection group={item} />}
      />
    </CollapsibleSection>
  )
}
