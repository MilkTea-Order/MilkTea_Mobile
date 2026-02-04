import { Header } from '@/components/layouts/Header'
import { OrderCard } from '@/components/organisms/OrderCard'
import { OrderFilterChips } from '@/components/organisms/OrderFilterChips'
import type { OrderFilter } from '@/features/order/api/order.api'
import { useOrders } from '@/features/order/hooks/useOrder'
import { useMe } from '@/features/user/hooks/useUser'
import { ORDER_STATUS_LABEL, STATUS, type OrderStatus } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { colors, status, effectiveTheme } = useTheme()
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>(STATUS.ORDER.UNPAID)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const params = useLocalSearchParams<{ filter?: string }>()
  const { data: meData, isPending: isLoadingUser } = useMe()
  const user = meData?.data
  const scrollViewRef = useRef<ScrollView>(null)

  const { orders, isLoading: isLoadingOrders, isRefetching, refetch } = useOrders(selectedFilter)

  // Read filter from query params
  useEffect(() => {
    if (params.filter) {
      const filterValue = params.filter
      // Validate filter value
      if (
        filterValue === STATUS.ORDER.UNPAID ||
        filterValue === STATUS.ORDER.PAID ||
        filterValue === STATUS.ORDER.CANCELED ||
        filterValue === STATUS.ORDER.NO_COLLECTED
      ) {
        setSelectedFilter(filterValue as OrderFilter)
      } else {
        setSelectedFilter(STATUS.ORDER.UNPAID)
      }
    } else {
      setSelectedFilter(STATUS.ORDER.UNPAID)
    }
  }, [params.filter])

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
    }, [])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }, [refetch])

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header
        title='Xin chào'
        subtitle={isLoadingUser ? 'Đang tải...' : user?.fullName || 'Nhân viên'}
        showBackButton={false}
        rightContent={
          <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/profile')}
            className='bg-white/20 rounded-full p-3'
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4
            }}
            activeOpacity={0.7}
          >
            <Ionicons name='person-circle-outline' size={28} color='white' />
          </TouchableOpacity>
        }
      >
        <OrderFilterChips selected={selectedFilter} onChange={setSelectedFilter} colors={colors} />
      </Header>

      {/* Orders List */}
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing || isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className='flex-row items-center justify-between mb-2'>
          <View className='flex-row items-center'>
            <Text className='text-lg font-bold' style={{ color: colors.text }}>
              Tổng cộng: {orders.length} bàn
            </Text>
          </View>
        </View>

        {/* Content */}
        {isLoadingOrders && orders.length === 0 ? (
          <View className='items-center justify-center py-20'>
            <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
              <Ionicons name='time-outline' size={48} color={colors.primary} />
            </View>
            <Text className='text-lg font-semibold mt-2' style={{ color: colors.text }}>
              Đang tải đơn hàng...
            </Text>
            <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
              Vui lòng đợi trong giây lát
            </Text>
          </View>
        ) : orders.length === 0 ? (
          <View className='items-center justify-center py-32'>
            <View className='rounded-full p-6 mb-4' style={{ backgroundColor: `${colors.primary}10` }}>
              <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
            </View>
            <Text className='text-xl font-bold mt-2' style={{ color: colors.text }}>
              Chưa có đơn hàng
            </Text>
            <Text className='text-sm mt-2 text-center px-8' style={{ color: colors.textSecondary }}>
              Không có đơn hàng {ORDER_STATUS_LABEL[selectedFilter as OrderStatus].toLowerCase()} nào
            </Text>
          </View>
        ) : (
          <View className='flex-row flex-wrap' style={{ gap: 12 }}>
            {orders.map((order) => (
              <View key={order.orderID} style={{ width: '48%' }}>
                <OrderCard
                  order={order}
                  colors={colors}
                  statusColors={status}
                  effectiveTheme={effectiveTheme}
                  onPressDetail={() => {
                    router.push(`/(protected)/order/detail?orderId=${order.orderID}` as any)
                  }}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push('/(protected)/order/select-menu' as any)}
        className='absolute bottom-6 right-6 rounded-full p-7'
        style={{
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8
        }}
        activeOpacity={0.8}
      >
        <Ionicons name='add' size={28} color='white' />
      </TouchableOpacity>
    </View>
  )
}
