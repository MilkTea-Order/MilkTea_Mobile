import { Header } from '@/components/layouts/Header'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { OrderCard } from '@/components/organisms/OrderCard'
import { useRevenueReport } from '@/features/report/hooks/useReport'
import { PAYMENT_METHOD, PaymentMethod } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function RevenueReportScreen() {
  const { colors, status, effectiveTheme } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()

  const [filter, setFilter] = useState({
    paymentMethod: PAYMENT_METHOD.CASH as PaymentMethod,
    fromDate: fromDate ?? null,
    toDate: toDate ?? null
  })

  const listRef = useRef<FlatList>(null)

  const { revenue, isLoading, isRefetching, refetch } = useRevenueReport(filter)

  const orders = revenue?.orders ?? []
  const statics = revenue?.statics

  const summary = useMemo(
    () => [
      {
        key: PAYMENT_METHOD.SHOPEE,
        label: 'Shopee',
        value: statics?.totalAmountShopee ?? 0
      },
      {
        key: PAYMENT_METHOD.BANK,
        label: 'Ngân hàng',
        value: statics?.totalAmountBank ?? 0
      },
      {
        key: PAYMENT_METHOD.GRAB,
        label: 'Grab',
        value: statics?.totalAmountGrab ?? 0
      },
      {
        key: PAYMENT_METHOD.CASH,
        label: 'Tiền mặt',
        value: statics?.totalAmountCash ?? 0
      }
    ],
    [statics]
  )

  const PAYMENT_ICON = {
    SHOPEE: 'cart-outline',
    BANK: 'card-outline',
    GRAB: 'car-outline',
    CASH: 'cash-outline'
  } as const

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Báo cáo doanh thu' />

      {/* 🔥 SUMMARY */}
      <View className='px-4 mt-3'>
        <Text className='text-lg font-bold mb-3' style={{ color: colors.text }}>
          Tổng doanh thu
        </Text>

        <View className='flex-row flex-wrap justify-between'>
          {summary.map((item) => {
            const isActive = filter.paymentMethod === item.key

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                onPress={() => {
                  setFilter((prev) => ({ ...prev, paymentMethod: item.key }))
                  listRef.current?.scrollToOffset({ offset: 0, animated: true })
                }}
                className='rounded-2xl p-4 mb-3'
                style={{
                  width: '48%',
                  backgroundColor: isActive ? colors.primary : colors.card,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <View className='flex-row items-center justify-between mb-2'>
                  <Text
                    style={{
                      color: isActive ? '#fff' : colors.textSecondary
                    }}
                  >
                    {item.label}
                  </Text>

                  <Ionicons name={PAYMENT_ICON[item.key]} size={18} color={isActive ? '#fff' : colors.textSecondary} />
                </View>

                <Text
                  className='text-lg font-bold'
                  style={{
                    color: isActive ? '#fff' : colors.text
                  }}
                >
                  {formatCurrencyVND(item.value)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* 🔥 DATE FILTER */}
      <View className='px-4'>
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
        />
      </View>

      {/* 🔥 LIST */}
      <FlatList
        ref={listRef}
        data={orders}
        keyExtractor={(item) => item.orderID.toString()}
        numColumns={3}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
          flexGrow: 1
        }}
        columnWrapperStyle={{ gap: 12, marginBottom: 8 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <View style={{ flexBasis: '31%', maxWidth: '31%', marginBottom: 8 }}>
            <OrderCard
              order={item}
              colors={colors}
              statusColors={status}
              effectiveTheme={effectiveTheme}
              onPressDetail={() => router.push(`/(protected)/order/detail?orderId=${item.orderID}` as any)}
            />
          </View>
        )}
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
      />
    </View>
  )
}
