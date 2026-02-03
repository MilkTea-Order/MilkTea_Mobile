import { Header } from '@/components/layouts/Header'
import { useEmptyTables } from '@/features/order/hooks/useTable'
import { useOrderStore } from '@/features/order/store/order.store'
import type { DinnerTable } from '@/features/order/types/table.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function SelectTableScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const { data: availableTables, isLoading, isRefetching, refetch } = useEmptyTables()
  const setTable = useOrderStore((s) => s.setTable)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }, [refetch])

  const handleSelect = (table: DinnerTable) => {
    setTable(table)
    router.replace('/(protected)/order/create-order')
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Chọn bàn' />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View className='flex-row items-center justify-between mb-4'>
          <View>
            <Text className='text-2xl font-bold' style={{ color: colors.text }}>
              Bàn trống
            </Text>
            <Text className='text-sm mt-1' style={{ color: colors.textSecondary }}>
              Chọn bàn để bắt đầu tạo đơn
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => refetch()}
            className='px-3 py-2 rounded-xl'
            style={{
              backgroundColor: `${colors.primary}15`,
              borderWidth: 1,
              borderColor: `${colors.primary}30`
            }}
          >
            <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
              Làm mới
            </Text>
          </TouchableOpacity> */}
        </View>

        {isLoading || isRefetching ? (
          <View className='py-6 items-center'>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : availableTables.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>Không có bàn khả dụng</Text>
        ) : (
          <View className='flex-row flex-wrap' style={{ gap: 12 }}>
            {availableTables.map((table) => {
              const tableImageUrl = (table as any).emptyImg || null
              return (
                <TouchableOpacity
                  key={table.tableID}
                  onPress={() => handleSelect(table)}
                  className='rounded-2xl border overflow-hidden'
                  style={{
                    width: '48%',
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                  }}
                  activeOpacity={0.85}
                >
                  <View
                    style={{
                      width: '100%',
                      height: 120,
                      backgroundColor: `${colors.primary}10`
                    }}
                  >
                    {tableImageUrl ? (
                      <Image
                        source={{ uri: tableImageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                      />
                    ) : (
                      <View className='flex-1 items-center justify-center'>
                        <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
                      </View>
                    )}
                  </View>

                  <View className='p-3'>
                    <Text className='text-base font-bold mb-1' style={{ color: colors.text }}>
                      {table.tableName}
                    </Text>
                    <View className='flex-row items-center'>
                      <Ionicons name='people-outline' size={14} color={colors.textSecondary} />
                      <Text className='text-xs ml-1' style={{ color: colors.textSecondary }}>
                        {table.numberOfSeat} ghế
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
