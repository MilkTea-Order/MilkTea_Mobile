import { Header } from '@/components/layouts/Header'
import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { OrderCardV2 } from '@/components/molecules/OrderCardV2'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { Order } from '@/features/order/types/order.type'
import { useRevenueReport } from '@/features/report/hooks/useReport'
import { RevenueReportDate } from '@/features/report/types/revenue.type'
import { PAYMENT_METHOD, PaymentMethod } from '@/shared/constants/other'
import { ORDER_STATUS_OPTIONS, OrderStatus, STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDisplayDate, getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function RevenueReportScreen() {
  const { colors } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()

  const [filter, setFilter] = useState({
    paymentMethod: PAYMENT_METHOD.CASH as PaymentMethod,
    fromDate: fromDate ?? null,
    toDate: toDate ?? null,
    orderStatusId: STATUS.ORDER.NO_COLLECTED as OrderStatus
  })

  const listRef = useRef<FlatList>(null)

  const { revenue, isLoading, isRefetching, refetch } = useRevenueReport(filter)

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        refetch()
      }
    }, [refetch, isLoading])
  )
  const statics = revenue?.statics
  const group = revenue?.dates
  // Group orders by date
  // const groupedOrders = useMemo(() => {
  //   const orders = revenue?.orders ?? []
  //   const groups: Record<string, Order[]> = {}
  //   orders.forEach((order) => {
  //     const dateKey = dayjs(order.orderDate).format('YYYY-MM-DD')
  //     if (!groups[dateKey]) groups[dateKey] = []
  //     groups[dateKey].push(order)
  //   })
  //   return Object.entries(groups)
  //     .sort(([a], [b]) => b.localeCompare(a))
  //     .map(([date, items]) => ({
  //       date,
  //       label: dayjs(date).format('DD/MM/YYYY'),
  //       orders: items.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  //     }))
  // }, [revenue?.orders])

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Báo cáo doanh thu' />
      {/* 🔥 FILTER BAR */}
      <View className='px-4 mt-2'>
        <DateFilterPicker
          value={{ fromDate: filter.fromDate, toDate: filter.toDate }}
          onChange={(range: { fromDate: string | null; toDate: string | null }) =>
            setFilter((prev: any) => ({
              ...prev,
              fromDate: range.fromDate,
              toDate: range.toDate
            }))
          }
          colors={colors}
          size='md'
        />
        {/* 🔥 ORDER STATUS FILTER */}
        <View className='mt-3'>
          <Text className='text-xs font-medium mb-2' style={{ color: colors.textSecondary }}>
            Trạng thái
          </Text>
          <View className='flex-row gap-2'>
            {ORDER_STATUS_OPTIONS.filter(
              (x) => x.value === STATUS.ORDER.NO_COLLECTED || x.value === STATUS.ORDER.PAID
            ).map((item) => {
              const isActive = filter.orderStatusId === item.value
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.8}
                  onPress={() => setFilter((prev) => ({ ...prev, orderStatusId: item.value }))}
                  className='rounded-full px-4 py-2'
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border
                  }}
                >
                  <Text className='text-sm font-medium' style={{ color: isActive ? '#fff' : colors.text }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
        {/* 🔥 PAYMENT METHOD FILTER */}
        <View className='mt-3'>
          <Text className='text-xs font-medium mb-2' style={{ color: colors.textSecondary }}>
            Phương thức
          </Text>
          <View className='flex-row gap-2'>
            {(
              [
                { key: PAYMENT_METHOD.CASH, label: 'Tiền mặt', value: statics?.totalAmountCash ?? 0, bg: '#4CAF50' },
                { key: PAYMENT_METHOD.SHOPEE, label: 'Shopee', value: statics?.totalAmountShopee ?? 0, bg: '#F44336' },
                {
                  key: PAYMENT_METHOD.BANK,
                  label: 'Chuyển khoản',
                  value: statics?.totalAmountBank ?? 0,
                  bg: '#2196F3'
                },
                { key: PAYMENT_METHOD.GRAB, label: 'Grab', value: statics?.totalAmountGrab ?? 0, bg: '#FF9800' }
              ] as const
            ).map((item) => {
              const isActive = filter.paymentMethod === item.key
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  onPress={() => {
                    setFilter((prev) => ({ ...prev, paymentMethod: item.key }))
                    listRef.current?.scrollToOffset({ offset: 0, animated: true })
                  }}
                  className='rounded-xl px-3 py-2'
                  style={{
                    backgroundColor: isActive ? item.bg : `${item.bg}15`,
                    borderWidth: 1.5,
                    borderColor: isActive ? item.bg : `${item.bg}40`,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isActive ? 0.15 : 0.04,
                    shadowRadius: isActive ? 4 : 2,
                    elevation: isActive ? 3 : 1
                  }}
                >
                  <Text className='text-xs font-bold' style={{ color: isActive ? '#fff' : item.bg }}>
                    {item.label}
                  </Text>
                  <Text
                    className='text-xs font-bold mt-0.5'
                    style={{ color: isActive ? 'rgba(255,255,255,0.9)' : item.bg }}
                  >
                    {formatCurrencyVND(item.value)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

      {/* 🔥 ORDER LIST - GROUPED BY DATE */}
      <FlatList<RevenueReportDate>
        ref={listRef}
        data={group}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          flexGrow: 1,
          marginTop: 10
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          isLoading ? (
            <View className='flex-1 justify-center items-center mt-20'>
              <ActivityIndicator size='large' color={colors.primary} />
              <Text className='mt-3' style={{ color: colors.textSecondary }}>
                Đang tải dữ liệu...
              </Text>
            </View>
          ) : (
            <View className='flex-1 justify-center items-center mt-20'>
              <Ionicons name='receipt-outline' size={50} color={colors.textSecondary} />
              <Text className='mt-3 text-base' style={{ color: colors.textSecondary }}>
                Không có đơn hàng
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item: group }) => {
          return (
            <CollapsibleSection
              defaultExpanded={false}
              headerContent={
                <View className='flex-row items-center'>
                  <View className='flex-row flex-1'>
                    <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}20` }}>
                      <Ionicons name='calendar-outline' size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text className='text-base font-bold' style={{ color: colors.text }}>
                        {formatDisplayDate(dayjs(group.date), 'DD/MM/YYYY')}
                      </Text>
                      <Text className='text-xs' style={{ color: colors.textSecondary }}>
                        {group.orders.length} đơn
                      </Text>
                    </View>
                  </View>
                  <Text className='text-sm font-bold mr-2' style={{ color: colors.primary }}>
                    {formatCurrencyVND(group.totalAmount)}
                  </Text>
                </View>
              }
            >
              <View className='px-4 pb-3'>
                {group.orders.map((order: Order, orderIndex: number) => (
                  <OrderCardV2 key={order.orderID} order={order} isLast={orderIndex === group.orders.length - 1} />
                ))}
              </View>
            </CollapsibleSection>
          )
        }}
      />
    </View>
  )
}
