import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { formatDate } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import React from 'react'
import { Text, View } from 'react-native'
import { Order, OrderDetail } from '../../types/order.type'
import { KitchenItemRow } from '../molecules/KitchenItemRow'

interface KitchenOrderSectionProps {
  order: Order
  checkedItems: Set<number>
  onToggleCheck: (item: OrderDetail) => void
  canCheck: boolean
  colors: {
    text: string
    textSecondary: string
    primary: string
    border: string
    card: string
  }
}

export function KitchenOrderSection({
  order,
  checkedItems,
  onToggleCheck,
  canCheck,
  colors
}: KitchenOrderSectionProps) {
  const itemCount = order.items.length

  return (
    <CollapsibleSection
      defaultExpanded={true}
      headerContent={
        <View className='flex-row items-center flex-1'>
          <View className='flex-1'>
            <View className='flex-row items-center'>
              <View className='rounded-xl p-2 mr-3' style={{ backgroundColor: `${colors.primary}20` }}>
                <Ionicons name='restaurant' size={18} color={colors.primary} />
              </View>
              <View>
                <Text className='text-base font-bold' style={{ color: colors.text }}>
                  {order.dinnerTable.name}
                </Text>
                <Text className='text-xs' style={{ color: colors.textSecondary }}>
                  {itemCount} món • {formatDate(order.createdDate ? dayjs(order.createdDate) : null, 'HH:mm')}
                </Text>
              </View>
            </View>
          </View>
          {canCheck && (
            <View className='px-3 py-1.5 rounded-full' style={{ backgroundColor: `${colors.primary}15` }}>
              <Text className='text-xs font-semibold' style={{ color: colors.primary }}>
                {checkedItems.size}/{itemCount} đã chọn
              </Text>
            </View>
          )}
        </View>
      }
    >
      <View className='px-2 pb-3 mt-1'>
        {order.items.map((item) => (
          <KitchenItemRow
            key={item.id}
            item={item}
            isChecked={checkedItems.has(item.id)}
            onToggleCheck={onToggleCheck}
            canCheck={canCheck}
            colors={colors}
          />
        ))}
      </View>
    </CollapsibleSection>
  )
}
