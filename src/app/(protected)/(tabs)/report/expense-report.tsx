import withFloatingButton from '@/components/hoc/withFloatingButton'
import { Header } from '@/components/layouts/Header'
import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { CreateExpenseModal } from '@/components/organisms/CreateExpenseModal'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { useFinanceGroupReport, useFinanceReport } from '@/features/report/hooks/useReport'
import { FinanceGroupReport, FinanceReport } from '@/features/report/types/finance.type'
import { useUserList } from '@/features/user/hooks/useUser'
import { MARGIN_FAB, SIZE_FAB } from '@/shared/constants/other'
import { ColorTheme } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDisplayDate, getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const COLOR_NEGATIVE = '#ef4444'
const COLOR_POSITIVE = '#22c55e'
const { width, height } = Dimensions.get('window')

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}

function FinanceItemRow({ item, isLast, amount }: any) {
  const { colors } = useTheme()
  const color = getAmountColor(amount)

  const displayTime = dayjs(item.createdDate).format('HH:mm')

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
          Giờ tạo: {displayTime}
        </Text>
      </View>
      <Text className='text-sm font-bold' style={{ color }}>
        {formatCurrencyVND(item.amount)}
      </Text>
    </View>
  )
}

function GroupSection({ group }: { group: FinanceGroupReport }) {
  const { colors } = useTheme()
  const color = getAmountColor(group.totalAmount)

  return (
    <CollapsibleSection
      icon={group.totalAmount < 0 ? 'arrow-down-circle' : 'arrow-up-circle'}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='flex-1'>
            <Text className='text-base font-bold' style={{ color: colors.text }}>
              {group.name}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {group.items.length} biến động
            </Text>
          </View>
          <Text className='text-base font-bold mr-2' style={{ color }}>
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
          <FinanceItemRow item={item} isLast={index === group.items.length - 1} amount={group.totalAmount} />
        )}
      />
    </CollapsibleSection>
  )
}

function DateGroup({ dateGroup }: { dateGroup: FinanceReport }) {
  const { colors } = useTheme()
  const color = getAmountColor(dateGroup.totalAmount)

  return (
    <CollapsibleSection
      icon={dateGroup.totalAmount < 0 ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='flex-1'>
            <Text className='text-sm font-bold' style={{ color: colors.text }}>
              {formatDisplayDate(dayjs(dateGroup.date), 'DD/MM/YYYY')}
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
        renderItem={({ item }) => <GroupSection group={item} />}
      />
    </CollapsibleSection>
  )
}

function ContentComponent(props: {
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
  onPress: () => void
  EmptyComponent: React.ComponentType<any> | React.ReactElement | null
}) {
  const { finance, colors, isRefetching, refetch, filter, setFilter, EmptyComponent } = props

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
        ListEmptyComponent={EmptyComponent}
        renderItem={({ item }) => (
          <View className='px-4'>
            <DateGroup dateGroup={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
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

          // Shadow (iOS)
          shadowColor: hasData ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: hasData ? 0.2 : 0,
          shadowRadius: 8,

          // Shadow (Android)
          elevation: hasData ? 8 : 0
        }}
      >
        <View className='flex-row items-center justify-between'>
          {/* LEFT */}
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
              {/* <Text className='text-xs' style={{ color: hasData ? 'rgba(255,255,255,0.8)' : 'transparent' }}>
                Tổng cộng
              </Text>
              <Text className='text-sm font-semibold' style={{ color: hasData ? 'white' : 'transparent' }}>
                {hasData ? `${finance.length} ngày giao dịch` : '0 ngày giao dịch'}
              </Text> */}
              <Text className='text-lg font-bold' style={{ color: hasData ? 'white' : 'transparent' }}>
                Tổng cộng
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <Text className='text-lg font-bold' style={{ color: hasData ? 'white' : 'transparent' }}>
            {formatCurrencyVND(totalAmount)}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function ExpenseReportScreen() {
  const { colors } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()
  const insets = useSafeAreaInsets()

  const [filter, setFilter] = useState({ fromDate, toDate })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { finance, isLoading, isRefetching, refetch } = useFinanceReport(filter)
  const { groups } = useFinanceGroupReport(showCreateModal)
  const { users } = useUserList(showCreateModal)

  const x = width - SIZE_FAB - MARGIN_FAB - insets.right
  const y = height - (SIZE_FAB + MARGIN_FAB + insets.bottom + 240)

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) refetch()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
  )

  const ContentWithFab = withFloatingButton(
    ContentComponent,
    (props: { colors: ColorTheme; onPress: () => void }) => (
      <TouchableOpacity
        onPress={props.onPress}
        className='rounded-full p-7'
        style={{
          backgroundColor: props.colors.primary,
          shadowColor: props.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <Ionicons name='add' size={28} color='white' />
      </TouchableOpacity>
    ),
    { defaultPosition: { x: x, y: y } }
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

      <ContentWithFab
        finance={finance}
        colors={colors}
        isLoading={isLoading}
        isRefetching={isRefetching}
        refetch={refetch}
        filter={filter}
        setFilter={setFilter}
        onPress={() => setShowCreateModal(true)}
        EmptyComponent={EmptyComponent}
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
