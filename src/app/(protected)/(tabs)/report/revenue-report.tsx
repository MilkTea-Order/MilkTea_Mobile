import { Header } from '@/components/layouts/Header'
import { DateFilterPicker } from '@/components/organisms/DateFilterPicker'
import { Order } from '@/features/order/types/order.type'
import { useRevenueReport } from '@/features/report/hooks/useReport'
import { PAYMENT_METHOD, PaymentMethod } from '@/shared/constants/other'
import { STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { getTodayDateRange } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function RevenueReportScreen() {
  const { colors } = useTheme()
  const { fromDate, toDate } = getTodayDateRange()

  const [filter, setFilter] = useState({
    paymentMethod: PAYMENT_METHOD.CASH as PaymentMethod,
    fromDate: fromDate ?? null,
    toDate: toDate ?? null
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
  const orders = revenue?.orders ?? []
  const statics = revenue?.statics

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups: Record<string, Order[]> = {}
    orders.forEach((order) => {
      const dateKey = dayjs(order.orderDate).format('YYYY-MM-DD')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(order)
    })
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        label: dayjs(date).format('DD/MM/YYYY'),
        orders: items.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      }))
  }, [orders])

  const totalByGroup = (groupOrders: Order[]) => groupOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)

  // Collapse order detail state
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const isOrderExpanded = (id: number) => expandedOrderId === id
  const toggleOrderDetail = (id: number) => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' }
    })
    setExpandedOrderId((prev) => (prev === id ? null : id))
  }

  const summary = useMemo(
    () => [
      {
        key: PAYMENT_METHOD.CASH,
        label: 'Tiền mặt',
        value: statics?.totalAmountCash ?? 0
      },
      {
        key: PAYMENT_METHOD.SHOPEE,
        label: 'Shopee',
        value: statics?.totalAmountShopee ?? 0
      },
      {
        key: PAYMENT_METHOD.BANK,
        label: 'Chuyển khoản',
        value: statics?.totalAmountBank ?? 0
      },
      {
        key: PAYMENT_METHOD.GRAB,
        label: 'Grab',
        value: statics?.totalAmountGrab ?? 0
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
      {/* 🔥 DATE FILTER */}
      <View className='mt-2 px-4'>
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
      {/* 🔥 SUMMARY */}
      <View className='px-4 mt-3'>
        <View className='flex-row items-center justify-between mb-3'>
          <Text className='text-base font-bold' style={{ color: colors.text }}>
            Tổng doanh thu
          </Text>
          <Text className='text-lg font-bold' style={{ color: colors.primary }}>
            {formatCurrencyVND(statics?.totalAmount ?? 0)}
          </Text>
        </View>

        <View className='flex-row'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {summary.map((item) => {
              const isActive = filter.paymentMethod === item.key

              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.8}
                  onPress={() => {
                    setFilter((prev) => ({ ...prev, paymentMethod: item.key }))
                    listRef.current?.scrollToOffset({ offset: 0, animated: true })
                  }}
                  className='rounded-2xl px-4 py-3'
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderWidth: 1.5,
                    borderColor: isActive ? colors.primary : colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isActive ? 0.15 : 0.06,
                    shadowRadius: isActive ? 6 : 3,
                    elevation: isActive ? 4 : 2
                  }}
                >
                  <View className='flex-row items-center gap-2 mb-1.5'>
                    <Ionicons
                      name={PAYMENT_ICON[item.key]}
                      size={14}
                      color={isActive ? '#fff' : colors.textSecondary}
                    />
                    <Text
                      className='text-xs font-medium'
                      style={{ color: isActive ? 'rgba(255,255,255,0.85)' : colors.textSecondary }}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Text className='text-sm font-bold' style={{ color: isActive ? '#fff' : colors.text }}>
                    {formatCurrencyVND(item.value)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </View>

      {/* 🔥 ORDER LIST - GROUPED BY DATE */}
      <FlatList
        ref={listRef}
        data={groupedOrders}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          flexGrow: 1
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
        renderItem={({ item: group, index }) => (
          <DateSection
            group={group}
            colors={colors}
            index={index}
            onToggleOrderDetail={toggleOrderDetail}
            expandedOrderId={expandedOrderId}
            isOrderExpanded={isOrderExpanded}
          />
        )}
      />
    </View>
  )
}

// ─── Inline sub-components ────────────────────────────────────────────────────

type DateSectionProps = {
  group: { date: string; label: string; orders: Order[] }
  colors: any
  index: number
  expandedOrderId: number | null
  isOrderExpanded: (id: number) => boolean
  onToggleOrderDetail: (id: number) => void
}

function DateSection({
  group,
  colors,
  index,
  expandedOrderId,
  isOrderExpanded,
  onToggleOrderDetail
}: DateSectionProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0)
  const rotateAnim = useRef(new Animated.Value(index === 0 ? 1 : 0)).current

  const toggleSection = () => {
    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' }
    })
    const toValue = isExpanded ? 0 : 1
    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start()
    setIsExpanded(!isExpanded)
  }

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

  const groupTotal = group.orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)

  return (
    <View
      className='mb-3 rounded-2xl overflow-hidden'
      style={{
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: isExpanded ? `${colors.primary}30` : colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isExpanded ? 0.1 : 0.05,
        shadowRadius: 8,
        elevation: isExpanded ? 4 : 2
      }}
    >
      {/* Section header */}
      <TouchableOpacity
        onPress={toggleSection}
        className='flex-row items-center justify-between px-4 py-3.5'
        activeOpacity={0.8}
        style={{ backgroundColor: isExpanded ? `${colors.primary}08` : 'transparent' }}
      >
        <View className='flex-row items-center flex-1'>
          <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}20` }}>
            <Ionicons name='calendar-outline' size={20} color={colors.primary} />
          </View>
          <View>
            <Text className='text-base font-bold' style={{ color: colors.text }}>
              {group.label}
            </Text>
            <Text className='text-xs' style={{ color: colors.textSecondary }}>
              {group.orders.length} đơn
            </Text>
          </View>
        </View>
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm font-bold' style={{ color: colors.primary }}>
            {formatCurrencyVND(groupTotal)}
          </Text>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons name='chevron-down' size={22} color={colors.primary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Orders */}
      {isExpanded && (
        <View className='px-4 pb-3'>
          {group.orders.map((order, orderIndex) => (
            <OrderRow
              key={order.orderID}
              order={order}
              colors={colors}
              isExpanded={isOrderExpanded(order.orderID)}
              onToggle={() => onToggleOrderDetail(order.orderID)}
              isLast={orderIndex === group.orders.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  )
}

type OrderRowProps = {
  order: Order
  colors: any
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
}

function OrderRow({ order, colors, isExpanded, onToggle, isLast }: OrderRowProps) {
  const tableImg = order.dinnerTable.usingImg
  const itemCount = order.orderDetails?.length ?? 0
  const firstItem = order.orderDetails?.[0]?.menu
  const isUnpaid = order.status.id === parseInt(STATUS.ORDER.UNPAID, 10)

  return (
    <View
      className={`rounded-xl overflow-hidden mb-2 ${!isLast ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
    >
      {/* Row header — always visible */}
      <TouchableOpacity onPress={onToggle} activeOpacity={0.75}>
        <View className='flex-row items-center px-3 py-3'>
          {/* Thumbnail */}
          <View className='rounded-xl overflow-hidden mr-3' style={{ width: 52, height: 52 }}>
            {tableImg ? (
              <Image source={{ uri: tableImg }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
            ) : (
              <View
                className='w-full h-full items-center justify-center'
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Ionicons name='restaurant-outline' size={22} color={colors.primary} />
              </View>
            )}
          </View>

          {/* Info */}
          <View className='flex-1 mr-2'>
            <View className='flex-row items-center gap-2 mb-0.5'>
              <Text className='text-sm font-bold' style={{ color: colors.text }} numberOfLines={1}>
                {order.dinnerTable.name}
              </Text>
              {/* Status badge */}
              <View
                className='px-1.5 py-0.5 rounded-full'
                style={{ backgroundColor: isUnpaid ? '#f59e0b25' : `${colors.primary}25` }}
              >
                <Text className='text-[9px] font-semibold' style={{ color: isUnpaid ? '#f59e0b' : colors.primary }}>
                  {order.status.name}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center gap-3'>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='time-outline' size={10} color={colors.textSecondary} />
                <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
                  {dayjs(order.orderDate).format('HH:mm')}
                </Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='list-outline' size={10} color={colors.textSecondary} />
                <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
                  {itemCount} món
                </Text>
              </View>
            </View>

            {/* Item names preview */}
            <Text className='text-[10px] mt-1' style={{ color: colors.textSecondary }} numberOfLines={1}>
              {firstItem?.name ?? '—'}
              {itemCount > 1 ? ` +${itemCount - 1} món` : ''}
            </Text>
          </View>

          {/* Amount + chevron */}
          <View className='items-end'>
            <Text className='text-sm font-bold mb-2' style={{ color: colors.primary }}>
              {formatCurrencyVND(order.totalAmount ?? 0)}
            </Text>
            <Animated.View style={{ transform: [{ rotate: `${isExpanded ? 180 : 0}deg` }] }}>
              <Ionicons name='chevron-up' size={14} color={colors.textSecondary} />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded detail */}
      {isExpanded && (
        <View className='px-3 pb-3'>
          <View className='rounded-xl overflow-hidden' style={{ backgroundColor: `${colors.primary}08` }}>
            {order.orderDetails?.map((detail, idx) => (
              <View
                key={detail.id}
                className={`flex-row items-center px-3 py-2.5 ${idx > 0 ? 'border-t' : ''}`}
                style={{ borderColor: `${colors.primary}20` }}
              >
                <View className='rounded-lg overflow-hidden mr-2.5' style={{ width: 38, height: 38 }}>
                  {detail.menu?.image ? (
                    <Image
                      source={{ uri: detail.menu.image ?? '' }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='cover'
                    />
                  ) : (
                    <View
                      className='w-full h-full items-center justify-center'
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <Ionicons name='cafe-outline' size={16} color={colors.primary} />
                    </View>
                  )}
                </View>
                <View className='flex-1'>
                  <Text className='text-xs font-semibold' style={{ color: colors.text }} numberOfLines={1}>
                    {detail.menu?.name ?? '—'}
                  </Text>
                  <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
                    x{detail.quantity} · {detail.price ? formatCurrencyVND(detail.price) : '—'}
                  </Text>
                </View>
                <Text className='text-xs font-bold' style={{ color: colors.primary }}>
                  {formatCurrencyVND((detail.price ?? 0) * detail.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}
