import { useMe } from '@/features/user/hooks/useUser'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Table {
  id: string
  tableNumber: string
  customerName?: string
  items: string[]
  total: number
  status: 'unpaid' | 'paid' | 'cancelled'
  time: string
  orderCount: number
}

const mockTables: Table[] = [
  {
    id: '1',
    tableNumber: 'Bàn 01',
    customerName: 'Nguyễn Văn A',
    items: ['Trà sữa truyền thống', 'Trà sữa matcha', 'Bánh flan'],
    total: 125000,
    status: 'unpaid',
    time: '10:30',
    orderCount: 3
  },
  {
    id: '2',
    tableNumber: 'Bàn 02',
    customerName: 'Trần Thị B',
    items: ['Trà sữa thái xanh', 'Trân châu đen'],
    total: 65000,
    status: 'unpaid',
    time: '10:25',
    orderCount: 2
  },
  {
    id: '3',
    tableNumber: 'Bàn 03',
    customerName: 'Lê Văn C',
    items: ['Trà sữa oolong', 'Kem cheese'],
    total: 95000,
    status: 'paid',
    time: '10:15',
    orderCount: 2
  },
  {
    id: '4',
    tableNumber: 'Bàn 04',
    customerName: 'Phạm Thị D',
    items: ['Trà sữa đào', 'Thạch dừa'],
    total: 75000,
    status: 'cancelled',
    time: '10:00',
    orderCount: 2
  },
  {
    id: '5',
    tableNumber: 'Bàn 05',
    items: ['Trà sữa matcha', 'Bánh mì chả cá'],
    total: 85000,
    status: 'unpaid',
    time: '11:00',
    orderCount: 2
  }
]

const statusLabels = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy'
}

const statusIcons = {
  unpaid: 'receipt-outline',
  paid: 'checkmark-circle-outline',
  cancelled: 'close-circle-outline'
}

type TableStatus = 'unpaid' | 'paid' | 'cancelled' | 'all'

export default function HomeScreen() {
  const [tables] = useState<Table[]>(mockTables)
  const [selectedFilter, setSelectedFilter] = useState<TableStatus>('all')
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { data: meData, isPending: isLoadingUser } = useMe()
  const user = meData?.data
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()
  const scrollViewRef = useRef<ScrollView>(null)

  // Scroll to top when tab is focused
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
    }, [])
  )

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const filteredTables = tables.filter((table) => {
    if (selectedFilter === 'all') return true
    return table.status === selectedFilter
  })

  const getStatusCount = (statusType: TableStatus) => {
    if (statusType === 'all') return tables.length
    return tables.filter((table) => table.status === statusType).length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusColor = (tableStatus: Table['status']) => {
    switch (tableStatus) {
      case 'unpaid':
        return { bg: '#FFF4E6', text: '#FF8C00', border: '#FFB84D', icon: '#FF8C00' }
      case 'paid':
        return { bg: '#E6F7E6', text: '#00AA00', border: '#4DD14D', icon: '#00AA00' }
      case 'cancelled':
        return { bg: '#FFE6E6', text: '#CC0000', border: '#FF4D4D', icon: '#CC0000' }
      default:
        return { bg: colors.card, text: colors.text, border: colors.border, icon: colors.primary }
    }
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20
        }}
      >
        <View className='flex-row items-center justify-between mb-6'>
          <View className='flex-1'>
            <Text className='text-white text-sm opacity-90 mb-1'>Xin chào,</Text>
            <Text className='text-white text-3xl font-bold'>
              {isLoadingUser ? 'Đang tải...' : user?.fullName || 'Nhân viên'}
            </Text>
          </View>
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
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 8 }}
          className='mb-4'
        >
          {(['all', 'unpaid', 'paid', 'cancelled'] as TableStatus[]).map((filterType) => {
            const isSelected = selectedFilter === filterType
            const count = getStatusCount(filterType)
            const label = filterType === 'all' ? 'Tất cả' : statusLabels[filterType as Table['status']]

            return (
              <TouchableOpacity
                key={filterType}
                onPress={() => setSelectedFilter(filterType)}
                className='rounded-full px-5 py-2.5 flex-row items-center'
                style={{
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.2)',
                  borderWidth: isSelected ? 0 : 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.15 : 0.08,
                  shadowRadius: 4,
                  elevation: isSelected ? 4 : 2
                }}
                activeOpacity={0.7}
              >
                {filterType !== 'all' && (
                  <Ionicons
                    name={statusIcons[filterType as Table['status']] as any}
                    size={18}
                    color={isSelected ? colors.primary : 'white'}
                    style={{ marginRight: 6 }}
                  />
                )}
                {filterType === 'all' && (
                  <Ionicons
                    name='grid-outline'
                    size={18}
                    color={isSelected ? colors.primary : 'white'}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text
                  className='text-sm font-bold'
                  style={{
                    color: isSelected ? colors.primary : 'white'
                  }}
                >
                  {label}
                </Text>
                <View
                  className='rounded-full px-2 py-0.5 ml-2'
                  style={{
                    backgroundColor: isSelected ? `${colors.primary}20` : 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Text
                    className='text-xs font-bold'
                    style={{
                      color: isSelected ? colors.primary : 'white'
                    }}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </LinearGradient>

      {/* Tables List */}
      <ScrollView
        ref={scrollViewRef}
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        scrollEventThrottle={16}
      >
        <View className='flex-row items-center justify-between mb-5'>
          <View>
            <Text className='text-2xl font-bold' style={{ color: colors.text }}>
              Danh sách bàn
            </Text>
            <Text className='text-sm mt-1' style={{ color: colors.textSecondary }}>
              {filteredTables.length} bàn{' '}
              {selectedFilter !== 'all' ? statusLabels[selectedFilter as Table['status']].toLowerCase() : ''}
            </Text>
          </View>
        </View>

        {filteredTables.length === 0 ? (
          <View className='items-center justify-center py-20'>
            <Ionicons name='restaurant-outline' size={64} color={colors.textSecondary} />
            <Text className='text-lg font-semibold mt-4' style={{ color: colors.textSecondary }}>
              Không có bàn nào
            </Text>
          </View>
        ) : (
          filteredTables.map((table) => {
            const statusColor = getStatusColor(table.status)

            return (
              <TouchableOpacity
                key={table.id}
                className='rounded-3xl p-5 mb-4 border-2'
                style={{
                  backgroundColor: colors.card,
                  borderColor: statusColor.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4
                }}
                activeOpacity={0.9}
              >
                {/* Table Header */}
                <View className='flex-row items-start justify-between mb-4'>
                  <View className='flex-1'>
                    <View className='flex-row items-center mb-3'>
                      <View
                        className='rounded-2xl p-2.5 mr-3'
                        style={{
                          backgroundColor: `${statusColor.icon}20`
                        }}
                      >
                        <Ionicons name='restaurant-outline' size={24} color={statusColor.icon} />
                      </View>
                      <View className='flex-1'>
                        <Text className='font-bold text-lg mb-1' style={{ color: colors.text }}>
                          {table.tableNumber}
                        </Text>
                        {table.customerName && (
                          <Text className='text-sm mb-1' style={{ color: colors.textSecondary }}>
                            {table.customerName}
                          </Text>
                        )}
                        <Text className='text-xs' style={{ color: colors.textSecondary }}>
                          {table.time} • {table.orderCount} món
                        </Text>
                      </View>
                    </View>

                    {/* Order Items */}
                    <View className='ml-14'>
                      {table.items.slice(0, 3).map((item, index) => (
                        <View key={index} className='flex-row items-center mb-2'>
                          <View className='w-1.5 h-1.5 rounded-full mr-2' style={{ backgroundColor: colors.primary }} />
                          <Text className='text-sm flex-1' style={{ color: colors.textSecondary }}>
                            {item}
                          </Text>
                        </View>
                      ))}
                      {table.items.length > 3 && (
                        <Text className='text-xs mt-1' style={{ color: colors.textSecondary }}>
                          +{table.items.length - 3} món khác
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Total Price */}
                  <View className='items-end'>
                    <Text className='text-xl font-bold mb-1' style={{ color: colors.text }}>
                      {formatCurrency(table.total)}
                    </Text>
                  </View>
                </View>

                {/* Table Footer */}
                <View
                  className='flex-row items-center justify-between pt-4'
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: colors.border
                  }}
                >
                  <View className='px-4 py-2 rounded-full' style={{ backgroundColor: statusColor.bg }}>
                    <Text className='text-xs font-bold' style={{ color: statusColor.text }}>
                      {statusLabels[table.status]}
                    </Text>
                  </View>
                  <View className='flex-row gap-2'>
                    <TouchableOpacity
                      className='px-4 py-2 rounded-xl'
                      style={{ backgroundColor: colors.primary }}
                      activeOpacity={0.8}
                      onPress={() => {
                        router.push(`/(protected)/order/detail?tableId=${table.id}` as any)
                      }}
                    >
                      <View className='flex-row items-center'>
                        <Ionicons name='eye-outline' size={16} color='white' />
                        <Text className='text-white text-sm font-bold ml-1'>Chi tiết</Text>
                      </View>
                    </TouchableOpacity>
                    {table.status === 'unpaid' && (
                      <TouchableOpacity
                        className='px-4 py-2 rounded-xl'
                        style={{ backgroundColor: '#FF4D4D' }}
                        activeOpacity={0.8}
                        onPress={() => {
                          // Handle cancel
                        }}
                      >
                        <Ionicons name='close-outline' size={16} color='white' />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      {/* Floating Create Order Button */}
      <TouchableOpacity
        onPress={() => router.push('/(protected)/order/create-order' as any)}
        className='absolute bottom-6 right-6 rounded-full p-5'
        style={{
          backgroundColor: colors.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
        activeOpacity={0.8}
      >
        <Ionicons name='add' size={28} color='white' />
      </TouchableOpacity>
    </View>
  )
}
