import { Header } from '@/components/layouts/Header'
import { CreateExpenseModal } from '@/components/organisms/CreateExpenseModal'
import { ExpenseReportContent } from '@/components/organisms/ExpenseReportContent'
import { useFinanceGroupReport, useFinanceReport } from '@/features/report/hooks/useReport'
import { useUserList } from '@/features/user/hooks/useUser'
import { MARGIN_FAB, SIZE_FAB } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'

import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

export default function ExpenseReportScreen() {
  const { colors } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()
  const insets = useSafeAreaInsets()

  const initialFilter = useMemo(() => ({ fromDate, toDate }), [fromDate, toDate])
  const [filter, setFilter] = useState(initialFilter)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { finance, isLoading, isRefetching, refetch } = useFinanceReport(filter)
  const { groups } = useFinanceGroupReport(showCreateModal)
  const { users } = useUserList(showCreateModal)

  const fabPosition = useMemo(
    () => ({
      x: width - SIZE_FAB - MARGIN_FAB - insets.right,
      y: height - (SIZE_FAB + MARGIN_FAB + insets.bottom + 240)
    }),
    [insets.right, insets.bottom]
  )
  useFocusEffect(
    useCallback(() => {
      if (!isLoading) refetch()
    }, [refetch, isLoading])
  )

  const EmptyComponent = useMemo(() => {
    const showLoading = isLoading || (isRefetching && finance.length === 0)

    if (showLoading) {
      return (
        <View className='items-center justify-center' style={{ minHeight: 300 }}>
          <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
            <Ionicons name='time-outline' size={48} color={colors.primary} />
          </View>
          <Text className='text-lg font-semibold mt-2' style={{ color: colors.text }}>
            Đang tải dữ liệu...
          </Text>
          <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      )
    }

    return (
      <View className='items-center justify-center' style={{ minHeight: 300 }}>
        <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
          <Ionicons name='receipt-outline' size={48} color={colors.primary} />
        </View>
        <Text className='text-xl font-bold mt-2' style={{ color: colors.text }}>
          Không có dữ liệu
        </Text>
        <Text className='text-sm mt-2 text-center px-8' style={{ color: colors.textSecondary }}>
          Không có biến động nào trong khoảng thời gian này
        </Text>
      </View>
    )
  }, [colors.primary, colors.text, colors.textSecondary, isLoading, isRefetching, finance.length])

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Quản lý thu chi' />

      <ExpenseReportContent
        finance={finance}
        colors={colors}
        isLoading={isLoading}
        isRefetching={isRefetching}
        refetch={refetch}
        filter={filter}
        setFilter={setFilter}
        onPress={() => setShowCreateModal(true)}
        EmptyComponent={EmptyComponent}
        fabPosition={fabPosition}
      />

      <CreateExpenseModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        users={users}
        groups={groups}
      />
    </View>
  )
}
