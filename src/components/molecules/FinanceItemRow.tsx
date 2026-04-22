import { FinanceItemReport } from '@/features/report/types/finance.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDate } from '@/shared/utils/date.util'

import dayjs from 'dayjs'
import React from 'react'
import { Text, View } from 'react-native'

const COLOR_NEGATIVE = '#ef4444'
const COLOR_POSITIVE = '#22c55e'

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}

interface FinanceItemRowProps {
  item: FinanceItemReport
  isLast: boolean
  amount: number
  isCollected: boolean
}

export function FinanceItemRow({ item, isLast, amount, isCollected }: FinanceItemRowProps) {
  const { colors } = useTheme()
  const color = getAmountColor(amount)

  return (
    <View
      className='flex-row items-center py-3'
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border
      }}
    >
      <View className='flex-1 mr-3'>
        <Text className='text-sm font-medium' style={{ color: colors.text }}>
          {item.name}
        </Text>
        <Text className='text-xs mt-0.5' style={{ color: colors.textSecondary }}>
          Giờ {isCollected ? 'thu' : 'chi'}: {formatDate(dayjs(item.actionDate), 'HH:mm')}
        </Text>
        {item.note && (
          <Text className='text-xs mt-0.5' style={{ color: colors.textSecondary }}>
            Ghi chú: {item.note}
          </Text>
        )}
      </View>
      <Text className='text-sm font-bold' style={{ color }}>
        {formatCurrencyVND(item.amount)}
      </Text>
    </View>
  )
}
