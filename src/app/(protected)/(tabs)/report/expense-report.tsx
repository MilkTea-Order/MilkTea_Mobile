import { Header } from '@/components/layouts/Header'
import { ExpenseEmptyState } from '@/components/molecules/ExpenseEmptyState'
import { CreateExpenseModal } from '@/components/organisms/CreateExpenseModal'
import { ExpenseReportContent } from '@/components/organisms/ExpenseReportContent'
import { useFinanceGroupReport, useFinanceReport } from '@/features/report/hooks/useReport'
import { useUserList } from '@/features/user/hooks/useUser'
import { MARGIN_FAB, SIZE_FAB } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { getTodayDateRange } from '@/shared/utils/date.util'

import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

export default function ExpenseReportScreen() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const { fromDate, toDate } = getTodayDateRange()
  const [filter, setFilter] = useState({ fromDate, toDate })

  const [showCreateModal, setShowCreateModal] = useState(false)

  const { finance, isLoading, isRefetching, refetch } = useFinanceReport(filter)
  const { groups } = useFinanceGroupReport(showCreateModal)
  const { users } = useUserList(showCreateModal)

  const fabPosition = {
    x: width - SIZE_FAB - MARGIN_FAB - insets.right,
    y: height - (SIZE_FAB + MARGIN_FAB + insets.bottom + 240)
  }
  useFocusEffect(
    useCallback(() => {
      if (!isLoading) refetch()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
  )
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
        EmptyComponent={
          <ExpenseEmptyState
            colors={colors}
            isLoading={isLoading}
            isRefetching={isRefetching}
            hasData={finance.length > 0}
          />
        }
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
