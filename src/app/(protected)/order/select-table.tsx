import { Header } from '@/components/layouts/Header'
import { TableCard } from '@/components/organisms/TableCard'
import { useEmptyTables } from '@/features/order/hooks/useTable'
import { useOrderStore } from '@/features/order/store/order.store'
import type { DinnerTable } from '@/features/order/types/table.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'

export default function SelectTableScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const { data: availableTables, isLoading, isRefetching, refetch } = useEmptyTables()
  const setTable = useOrderStore((s) => s.setTable)
  const selectedTable = useOrderStore((s) => s.table)
  const { isChangeTable } = useLocalSearchParams<{ isChangeTable: string }>()

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }, [refetch])

  const handleBack = () => {
    if (selectedTable) {
      router.replace('/(protected)/order/select-menu')
    } else {
      router.dismissAll()
    }
  }

  const handleSelect = (table: DinnerTable) => {
    setTable(table)
    router.replace('/(protected)/order/select-menu')
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Chọn bàn' onBack={handleBack} />

      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
      >
        <View className='flex-row items-center justify-between mb-4'>
          <View>
            <Text className='text-xl font-bold' style={{ color: colors.text }}>
              Chọn bàn {isChangeTable === 'true' ? 'để chuyển' : 'để bắt đầu tạo đơn'}
            </Text>
          </View>
        </View>

        {isLoading || isRefetching ? (
          <View className='py-6 items-center'>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : availableTables.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>Không có bàn khả dụng</Text>
        ) : (
          <View className='flex-row flex-wrap' style={{ gap: 12 }}>
            {availableTables
              .filter((table) => table.id !== selectedTable?.id)
              .map((table) => (
                <TableCard key={table.id} table={table} onPress={handleSelect} />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
