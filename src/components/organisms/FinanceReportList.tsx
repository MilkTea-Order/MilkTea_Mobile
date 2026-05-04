import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { FinanceDateGroup } from '@/components/organisms/FinanceDateGroup'
import { FinanceReport } from '@/features/report/types/finance.type'
import { ColorTheme } from '@/shared/constants/theme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

import React from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'

const COLOR_NEGATIVE = '#ef4444'
const COLOR_POSITIVE = '#22c55e'

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}
interface FinanceReportListProps {
  finance: FinanceReport[]
  colors: ColorTheme
  isLoading: boolean
  isRefetching: boolean
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<FinanceReport[], Error>>
  filter: {
    fromDate: string
    toDate: string
  }
  setFilter: React.Dispatch<
    React.SetStateAction<{
      fromDate: string
      toDate: string
    }>
  >
  EmptyComponent: React.ComponentType<any> | React.ReactElement | null
}

export function FinanceReportList({
  finance,
  colors,
  isRefetching,
  refetch,
  filter,
  setFilter,
  EmptyComponent
}: FinanceReportListProps) {
  const totalAmount = finance.reduce((sum, dateGroup) => sum + dateGroup.totalAmount, 0)
  const totalColor = getAmountColor(totalAmount)
  const hasData = finance.length > 0

  return (
    <View className='flex-1'>
      <View className='flex mt-2 px-4 pb-3'>
        <DateFilterPicker value={filter} onChange={(range: any) => setFilter(range)} colors={colors} size='lg' />
      </View>
      <FlatList
        data={finance}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        refreshing={isRefetching}
        ListEmptyComponent={EmptyComponent}
        renderItem={({ item }) => (
          <View className='px-4'>
            <FinanceDateGroup dateGroup={item} />
          </View>
        )}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: hasData ? totalColor : 'transparent',
          opacity: hasData ? 1 : 0,
          shadowColor: hasData ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: hasData ? 0.2 : 0,
          shadowRadius: 8,
          elevation: hasData ? 8 : 0
        }}
      >
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <View
              style={{
                backgroundColor: hasData ? 'rgba(255,255,255,0.2)' : 'transparent',
                padding: 8,
                borderRadius: 10,
                marginRight: 10
              }}
            >
              <Ionicons name='wallet-outline' size={18} color={hasData ? 'white' : 'transparent'} />
            </View>
            <View>
              <Text className='text-lg font-bold' style={{ color: hasData ? 'white' : 'transparent' }}>
                Tổng cộng
              </Text>
            </View>
          </View>
          <Text className='text-lg font-bold' style={{ color: hasData ? 'white' : 'transparent' }}>
            {formatCurrencyVND(totalAmount)}
          </Text>
        </View>
      </View>
    </View>
  )
}
