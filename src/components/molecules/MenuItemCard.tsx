import { useMenuSizes } from '@/features/order/hooks/useMenu'
import type { OrderLine } from '@/features/order/store/order.store'
import type { Menu } from '@/features/order/types/menu.type'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

type CartQuantityGetter = (menuId: number, sizeId: number) => number
type OnAdd = (orderLine: OrderLine) => void
type OnRemove = (menuId: number, sizeId: number) => void

type Props = {
  menu: Menu
  colors: {
    card: string
    border: string
    text: string
    textSecondary: string
    primary: string
  }
  getQuantity: CartQuantityGetter
  onAdd: OnAdd
  onRemove: OnRemove
  formatCurrency: (amount: number) => string
}

export const MenuItemCard: React.FC<Props> = ({ menu, colors, getQuantity, onAdd, onRemove, formatCurrency }) => {
  const [expanded, setExpanded] = useState(false)
  const { data: sizes, isLoading } = useMenuSizes(menu.id)

  return (
    <View
      className='rounded-2xl p-5 mb-3 border'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.85}
        className='flex-row items-start justify-between mb-3'
      >
        <View className='flex-1 mr-3'>
          <Text className='text-lg font-bold mb-1' style={{ color: colors.text }}>
            {menu.name}
          </Text>
          <Text className='text-sm' style={{ color: colors.textSecondary }}>
            {menu.code}
          </Text>
          <Text className='text-xs mt-1' style={{ color: colors.textSecondary }}>
            {expanded ? 'Ẩn size' : 'Chạm để chọn size'}
          </Text>
        </View>
        <View className='items-end'>
          <View className='rounded-full p-2' style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name='restaurant-outline' size={20} color={colors.primary} />
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textSecondary}
            style={{ marginTop: 6 }}
          />
        </View>
      </TouchableOpacity>

      {!expanded ? null : isLoading ? (
        <View className='py-3'>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : sizes.length === 0 ? (
        <Text className='text-sm' style={{ color: colors.textSecondary }}>
          Chưa có size khả dụng
        </Text>
      ) : (
        <View className='gap-2'>
          {sizes.map((size) => {
            const quantity = getQuantity(menu.id, size.id)
            return (
              <View
                key={size.id}
                className='flex-row items-center justify-between rounded-xl px-3 py-2'
                style={{
                  backgroundColor: `${colors.primary}${quantity > 0 ? '20' : '12'}`,
                  borderWidth: quantity > 0 ? 1.5 : 1,
                  borderColor: quantity > 0 ? colors.primary : 'transparent'
                }}
              >
                <View className='flex-1 mr-3'>
                  <Text className='text-base font-semibold' style={{ color: colors.text }}>
                    {size.name}
                  </Text>
                  <Text className='text-sm font-bold' style={{ color: colors.primary }}>
                    {formatCurrency(size.price?.price ?? 0)}
                  </Text>
                </View>
                {quantity > 0 ? (
                  <View className='flex-row items-center'>
                    <TouchableOpacity
                      onPress={() => onRemove(menu.id, size.id)}
                      className='rounded-full p-1.5'
                      style={{ backgroundColor: colors.primary }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name='remove' size={18} color='white' />
                    </TouchableOpacity>
                    <Text className='text-lg font-bold mx-3 min-w-[28px] text-center' style={{ color: colors.primary }}>
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        onAdd({
                          menuId: menu.id,
                          menuName: menu.name,
                          menuImage: menu.image ?? null,
                          sizeId: size.id,
                          sizeName: size.name,
                          price: size.price?.price ?? 0,
                          quantity: 1
                        })
                      }
                      className='rounded-full p-1.5'
                      style={{ backgroundColor: colors.primary }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name='add' size={18} color='white' />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      onAdd({
                        menuId: menu.id,
                        menuName: menu.name,
                        menuImage: menu.image ?? null,
                        sizeId: size.id,
                        sizeName: size.name,
                        price: size.price?.price ?? 0,
                        quantity: 1
                      })
                    }
                    className='rounded-full px-4 py-2'
                    style={{ backgroundColor: colors.primary }}
                    activeOpacity={0.8}
                  >
                    <Text className='text-white font-semibold'>Chọn</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}
