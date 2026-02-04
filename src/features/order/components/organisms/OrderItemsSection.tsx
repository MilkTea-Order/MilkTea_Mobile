import { OrderItemRow } from '@/features/order/components/molecules/OrderItemRow'
import { OrderItemsEmptyState } from '@/features/order/components/molecules/OrderItemsEmptyState'
import type { OrderDetail } from '@/features/order/types/order.type'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, Text, View } from 'react-native'
const SCREEN_HEIGHT = Dimensions.get('window').height

interface OrderItemsSectionProps {
  items: OrderDetail[]
  totalQty: number
  isLoading: boolean
  isRefetching: boolean
  onRefresh: () => void
  onCancelItem?: (orderDetailId: number) => void
  onUpdateItem?: (orderDetailId: number) => void
  cancellingItemId?: number | null
  colors: {
    card: string
    border: string
    primary: string
    text: string
    textSecondary: string
  }
}

export function OrderItemsSection({
  items,
  totalQty,
  isLoading,
  isRefetching,
  onRefresh,
  onCancelItem,
  onUpdateItem,
  cancellingItemId,
  colors
}: OrderItemsSectionProps) {
  return (
    <View
      className='rounded-3xl p-6 border-2'
      style={{
        maxHeight: SCREEN_HEIGHT * 0.52,
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      <View className='flex-row items-center mb-5'>
        <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}15` }}>
          <Ionicons name='list-outline' size={24} color={colors.primary} />
        </View>
        <Text className='text-xl font-bold flex-1' style={{ color: colors.text }}>
          Danh sách món - Số lượng: {totalQty}
        </Text>

        {isRefetching && (
          <View className='ml-2'>
            <ActivityIndicator size='small' color={colors.primary} />
          </View>
        )}
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
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
          ListEmptyComponent={<OrderItemsEmptyState colors={colors} />}
        />
      )}
    </View>
  )
}
