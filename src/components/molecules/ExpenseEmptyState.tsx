import { ColorTheme } from '@/shared/constants/theme'
import { Ionicons } from '@expo/vector-icons'

import React from 'react'
import { Text, View } from 'react-native'

interface ExpenseEmptyStateProps {
  colors: ColorTheme
  isLoading: boolean
  isRefetching: boolean
  hasData: boolean
}

export function ExpenseEmptyState({ colors, isLoading, isRefetching, hasData }: ExpenseEmptyStateProps) {
  const showLoading = isLoading || (isRefetching && !hasData)

  return (
    <View className='flex-1 items-center justify-center'>
      {showLoading ? (
        <>
          <View className='mb-4 rounded-full p-6' style={{ backgroundColor: `${colors.primary}10` }}>
            <Ionicons name='time-outline' size={48} color={colors.primary} />
          </View>
          <Text className='mt-2 text-lg font-semibold' style={{ color: colors.text }}>
            Đang tải dữ liệu...
          </Text>
          <Text className='mt-2 text-center text-sm' style={{ color: colors.textSecondary }}>
            Vui lòng đợi trong giây lát
          </Text>
        </>
      ) : (
        <>
          <View className='mb-4 rounded-full p-6' style={{ backgroundColor: `${colors.primary}10` }}>
            <Ionicons name='receipt-outline' size={48} color={colors.primary} />
          </View>
          <Text className='mt-2 text-xl font-bold' style={{ color: colors.text }}>
            Không có dữ liệu
          </Text>
          <Text className='mt-2 px-8 text-center text-sm' style={{ color: colors.textSecondary }}>
            Không có biến động nào trong khoảng thời gian này
          </Text>
        </>
      )}
    </View>
  )
}
