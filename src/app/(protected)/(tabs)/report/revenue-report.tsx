import { Header } from '@/components/layouts/Header'
import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { OrderCardV2 } from '@/components/molecules/OrderCardV2'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { Order } from '@/features/order/types/order.type'
import { useRevenueReport } from '@/features/report/hooks/useReport'
import { RevenueReportDate } from '@/features/report/types/revenue.type'
import { PAYMENT_METHOD, PAYMENT_METHODS, PaymentMethod } from '@/shared/constants/payment'
import { ORDER_STATUS_OPTIONS, OrderStatus, STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDisplayDate, getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { router, useFocusEffect } from 'expo-router'
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

  const handleOnPressItem = (orderId: number) => {
    router.push({
      pathname: '/(protected)/order/detail',
      params: { orderId: orderId, review: String(true) }
    })
  }
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
          size='lg'
        />
        {/* 🔥 ORDER STATUS FILTER */}
        <View className='mt-3'>
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
        <FlatList
          data={PAYMENT_METHODS}
          keyExtractor={(item) => item.id}
          // numColumns={4}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            marginTop: 12
          }}
          renderItem={({ item: method }) => {
            const valueMap = {
              CASH: statics?.totalAmountCash ?? 0,
              BANK: statics?.totalAmountBank ?? 0,
              SHOPEE: statics?.totalAmountShopee ?? 0,
              GRAB: statics?.totalAmountGrab ?? 0
            }

            const value = valueMap[method.id]
            const isActive = filter.paymentMethod === method.id

            return (
              <TouchableOpacity
                className='flex items-center px-2 py-1'
                activeOpacity={0.8}
                onPress={() => {
                  setFilter((prev) => ({ ...prev, paymentMethod: method.id }))
                  listRef.current?.scrollToOffset({ offset: 0, animated: true })
                }}
                style={{
                  // flexBasis: '22%',
                  // maxWidth: '22%',
                  borderRadius: 14,
                  backgroundColor: isActive ? method.iconColor : `${method.iconColor}10`,
                  borderWidth: 1,
                  borderColor: isActive ? method.iconColor : `${method.iconColor}30`
                }}
              >
                {/* ICON */}
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 6,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${method.iconColor}20`
                  }}
                >
                  {method.logo ? (
                    <method.logo width={20} height={20} />
                  ) : (
                    <Ionicons name={method.icon as any} size={18} color={isActive ? '#fff' : method.iconColor} />
                  )}
                </View>

                {/* VALUE */}
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isActive ? '#fff' : method.iconColor
                  }}
                >
                  {formatCurrencyVND(value)}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
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
          marginTop: 5
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          !isRefetching && isLoading ? (
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
                Không có dữ liệu
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
                    <View className='flex justify-center mr-3'>
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
              <View className='px-3 pb-3 mt-1'>
                {group.orders.map((order: Order, orderIndex: number) => (
                  <OrderCardV2
                    key={order.orderID}
                    order={order}
                    isLast={orderIndex === group.orders.length - 1}
                    onPress={handleOnPressItem}
                  />
                ))}
              </View>
            </CollapsibleSection>
          )
        }}
      />
    </View>
  )
}
