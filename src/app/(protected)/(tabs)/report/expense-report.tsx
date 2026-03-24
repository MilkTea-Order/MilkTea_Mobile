import { Header } from '@/components/layouts/Header'
import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { CreateExpenseModal } from '@/components/organisms/CreateExpenseModal'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { useFinanceGroupReport, useFinanceReport } from '@/features/report/hooks/useReport'
import { FinanceReport, FinanceReportDate } from '@/features/report/types/finance.type'
import { useUserList } from '@/features/user/hooks/useUser'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDisplayDate, getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'

import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const COLOR_NEGATIVE = '#ef4444' // đỏ: số âm
const COLOR_POSITIVE = '#22c55e' // xanh: số dương

function getAmountColor(amount: number) {
  return amount < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE
}

function FinanceItemRow({
  item,
  isLast,
  amount
}: {
  item: { id: number; name: string; amount: number; createdDate: string }
  isLast: boolean
  amount: number
}) {
  const { colors } = useTheme()
  const color = getAmountColor(amount)

  // createdDate is UTC — convert to local for display time
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

function DateGroup({ dateGroup, defaultExpanded }: { dateGroup: FinanceReportDate; defaultExpanded: boolean }) {
  const { colors } = useTheme()
  const color = getAmountColor(dateGroup.totalAmount)

  return (
    <CollapsibleSection
      defaultExpanded={defaultExpanded}
      icon={dateGroup.totalAmount < 0 ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${color}20` }}>
            <Ionicons name='calendar-outline' size={18} color={color} />
          </View>
          <View className='flex-1'>
            <Text className='text-sm font-bold' style={{ color: colors.text }}>
              {formatDisplayDate(dayjs(dateGroup.date), 'DD/MM/YYYY')}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {dateGroup.items.length} biến động
            </Text>
          </View>
          <Text className='text-sm font-bold mr-2' style={{ color }}>
            {formatCurrencyVND(dateGroup.totalAmount)}
          </Text>
        </View>
      }
    >
      <View className='px-1 pb-1'>
        <FlatList
          data={dateGroup.items}
          scrollEnabled={false}
          keyExtractor={(item) => `${item.id}`}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item, index }) => (
            <FinanceItemRow item={item} isLast={index === dateGroup.items.length - 1} amount={dateGroup.totalAmount} />
          )}
        />
      </View>
    </CollapsibleSection>
  )
}

function GroupSection({ group }: { group: FinanceReport }) {
  const { colors } = useTheme()
  const color = getAmountColor(group.totalAmount)
  const isNegative = group.totalAmount < 0

  return (
    <CollapsibleSection
      // defaultExpanded={true}
      icon={isNegative ? 'arrow-down-circle' : 'arrow-up-circle'}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='rounded-xl p-2.5 mr-3' style={{ backgroundColor: `${color}20` }}>
            <Ionicons name={isNegative ? 'arrow-down-outline' : 'arrow-up-outline'} size={22} color={color} />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-bold' style={{ color: colors.text }}>
              {group.name}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {group.dates.length} ngày
            </Text>
          </View>
          <Text className='text-base font-bold mr-2' style={{ color }}>
            {formatCurrencyVND(group.totalAmount)}
          </Text>
        </View>
      }
    >
      <FlatList
        data={group.dates}
        scrollEnabled={false}
        keyExtractor={(item) => `${item.date}`}
        contentContainerStyle={{ gap: 8, flexGrow: 1 }}
        renderItem={({ item, index }) => <DateGroup dateGroup={item} defaultExpanded={false} />}
      />
    </CollapsibleSection>
  )
}

// function ContentComponent({ onOpenCreate }: { onOpenCreate: () => void }) {
//   const { colors } = useTheme()

//   const { fromDate, toDate } = getTodayDateRange()
//   const [filter, setFilter] = useState({
//     fromDate: fromDate ?? null,
//     toDate: toDate ?? null
//   })

//   const { finance, isLoading, isRefetching, refetch } = useFinanceReport(filter)

//   return (
//     <View className='flex-1'>
//       <FlatList
//         data={finance}
//         keyExtractor={(item) => `group-${item.id}`}
//         contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
//         refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
//         ListHeaderComponent={
//           <View className='mt-2 px-4 pb-3'>
//             <DateFilterPicker
//               value={{ fromDate: filter.fromDate, toDate: filter.toDate }}
//               onChange={(range: { fromDate: string | null; toDate: string | null }) =>
//                 setFilter({
//                   fromDate: range.fromDate as string,
//                   toDate: range.toDate as string
//                 })
//               }
//               colors={colors}
//               size='lg'
//             />
//           </View>
//         }
//         ListEmptyComponent={isLoading ? <ActivityIndicator /> : <Text>Không có dữ liệu</Text>}
//         renderItem={({ item }) => (
//           <View className='px-4'>
//             <GroupSection group={item} />
//           </View>
//         )}
//       />
//     </View>
//   )
// }

// const ContentWithFab = withFloatingButton(ContentComponent, (props: { onOpenCreate: () => void }) => (
//   <TouchableOpacity
//     onPress={props.onOpenCreate}
//     className='absolute bottom-24 right-5 w-14 h-14 rounded-full items-center justify-center'
//     style={{
//       // backgroundColor: colors.primary,
//       // shadowColor: colors.primary,
//       backgroundColor: '#FB923C',
//       shadowColor: '#FB923C',
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.35,
//       shadowRadius: 8,
//       elevation: 8
//     }}
//     activeOpacity={0.85}
//   >
//     <Ionicons name='add' size={28} color='#fff' />
//   </TouchableOpacity>
// ))

// export default function ExpenseReportScreen() {
//   const { colors } = useTheme()

//   const [showCreateModal, setShowCreateModal] = useState(false)

//   const { groups: groupFinance } = useFinanceGroupReport(showCreateModal)
//   const { users } = useUserList(showCreateModal)

//   return (
//     <View className='flex-1' style={{ backgroundColor: colors.background }}>
//       <Header title='Quản lý thu chi' />

//       {/* CONTENT + FAB */}
//       <ContentWithFab onOpenCreate={() => setShowCreateModal(true)} />

//       {/* MODAL */}
//       <CreateExpenseModal
//         visible={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         users={users}
//         groups={groupFinance}
//       />
//     </View>
//   )
// }

export default function ExpenseReportScreen() {
  const { colors } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()

  const [filter, setFilter] = useState({
    fromDate: fromDate ?? null,
    toDate: toDate ?? null
  })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { finance, isLoading, isRefetching, refetch } = useFinanceReport(filter)

  // Load khi mở modal
  const { groups: groupFinance } = useFinanceGroupReport(showCreateModal)
  const { users } = useUserList(showCreateModal)

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        refetch()
      }
    }, [refetch, isLoading])
  )

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Quản lý thu chi' />

      <FlatList
        data={finance}
        keyExtractor={(item) => `group-${item.id}`}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View className='mt-2 px-4 pb-3'>
            <DateFilterPicker
              value={{ fromDate: filter.fromDate, toDate: filter.toDate }}
              onChange={(range: { fromDate: string | null; toDate: string | null }) =>
                setFilter({
                  fromDate: range.fromDate as string,
                  toDate: range.toDate as string
                })
              }
              colors={colors}
              size='lg'
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='large' color={colors.primary} />
              <Text className='mt-3' style={{ color: colors.textSecondary }}>
                Đang tải dữ liệu...
              </Text>
            </View>
          ) : (
            <View className='flex-1 justify-center items-center'>
              <Ionicons name='wallet-outline' size={50} color={colors.textSecondary} />
              <Text className='mt-3 text-base' style={{ color: colors.textSecondary }}>
                Không có dữ liệu thu chi
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item: group }) => (
          <View className='px-4'>
            <GroupSection group={group} />
          </View>
        )}
      />

      {/* FAB: Tạo thu chi */}
      <TouchableOpacity
        onPress={() => setShowCreateModal(true)}
        className='absolute bottom-24 right-5 w-14 h-14 rounded-full items-center justify-center'
        style={{
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8
        }}
        activeOpacity={0.85}
      >
        <Ionicons name='add' size={28} color='#fff' />
      </TouchableOpacity>

      <CreateExpenseModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        users={users}
        groups={groupFinance}
      />
    </View>
  )
}
