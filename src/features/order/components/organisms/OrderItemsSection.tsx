import { FilterDropdown } from '@/features/order/components/molecules/FilterDropdown'
import { OrderItemRow } from '@/features/order/components/molecules/OrderItemRow'
import { OrderItemsEmptyState } from '@/features/order/components/molecules/OrderItemsEmptyState'
import type { OrderDetail } from '@/features/order/types/order.type'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'
const SCREEN_HEIGHT = Dimensions.get('window').height

interface OrderItemsSectionProps {
  items: OrderDetail[]
  totalQty: number
  isLoading: boolean
  isRefetching: boolean
  canActionButton: boolean
  onRefresh: () => void
  onCancelItem?: (item: OrderDetail) => void
  onUpdateItem?: (orderDetailId: number) => void
  cancellingItemId?: number | null
  filterMode?: 'placed' | 'cancelled'
  onFilterChange?: (value: 'placed' | 'cancelled') => void
  onAddItems?: () => void
  colors: {
    card: string
    border: string
    primary: string
    text: string
    textSecondary: string
    background: string
  }
}

export function OrderItemsSection({
  items,
  totalQty,
  isLoading,
  isRefetching,
  canActionButton,
  onRefresh,
  onCancelItem,
  onUpdateItem,
  cancellingItemId,
  filterMode,
  onFilterChange,
  onAddItems,
  colors
}: OrderItemsSectionProps) {
  const filterOptions = [
    { label: 'Đã đặt', value: 'placed' as const, icon: 'checkmark-circle-outline' as const },
    { label: 'Đã hủy', value: 'cancelled' as const, icon: 'close-circle-outline' as const }
  ]

  return (
    <View
      className='rounded-3xl p-6 border-2'
      style={{
        maxHeight: SCREEN_HEIGHT * 0.63,
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      <View className='mb-3'>
        <View className='flex-row items-center'>
          <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name='list-outline' size={24} color={colors.primary} />
          </View>
          <View className='flex-1'>
            <Text className='text-xl font-bold mb-1' style={{ color: colors.text }}>
              Danh sách món - Số lượng: {totalQty}
            </Text>
            {/* Filter dropdown dưới chữ Danh sách món */}
            {onFilterChange && filterMode !== undefined && (
              <FilterDropdown
                value={filterMode}
                options={filterOptions}
                onChange={onFilterChange}
                colors={colors}
                icon='funnel-outline'
              />
            )}
          </View>

          {onAddItems && (
            <TouchableOpacity
              onPress={onAddItems}
              className='rounded-full p-2'
              style={{ backgroundColor: `${colors.primary}15` }}
              activeOpacity={0.7}
            >
              <Ionicons name='add-circle-outline' size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className='py-10 items-center justify-center'>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text className='text-base mt-3' style={{ color: colors.textSecondary }}>
            Đang tải danh sách món...
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4, paddingTop: 12 }}
          refreshing={false}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <OrderItemRow
              item={item}
              colors={colors}
              onCancel={onCancelItem}
              onUpdate={onUpdateItem}
              isCancelling={cancellingItemId === Number(item.id)}
              canActionButton={canActionButton}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
          ListEmptyComponent={<OrderItemsEmptyState colors={colors} />}
        />
      )}
    </View>
  )
}
