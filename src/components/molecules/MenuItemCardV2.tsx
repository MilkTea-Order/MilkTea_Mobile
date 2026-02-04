import { useMenuSizes } from '@/features/order/hooks/useMenu'
import { useOrderStore, type OrderLine } from '@/features/order/store/order.store'
import type { MenuItem, MenuSize } from '@/features/order/types/meny_catalog.type'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2

type Props = {
  menu: MenuItem
  colors: {
    card: string
    border: string
    text: string
    textSecondary: string
    primary: string
  }
  onAdd: (orderLine: OrderLine) => void
  onRemove: (menuId: number, sizeId: number) => void
  formatCurrency: (amount: number) => string
  activeSize: { menuId: number; sizeId: number } | null
  onChangeActiveSize: (next: { menuId: number; sizeId: number } | null) => void
}

export default function MenuItemCardV2({
  menu,
  colors,
  onAdd,
  onRemove,
  formatCurrency,
  activeSize,
  onChangeActiveSize
}: Props) {
  const { data: sizes, isLoading } = useMenuSizes(menu.menuId)

  const orderItems = useOrderStore((s) => s.items)
  const getQuantityReactive = (menuId: number, sizeId: number) => {
    return orderItems.find((item) => item.menuId === menuId && item.sizeId === sizeId)?.quantity ?? 0
  }

  const expandedBadgeSizeId = activeSize?.menuId === menu.menuId && activeSize?.sizeId ? activeSize?.sizeId : null

  const handleSizePress = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.menuId, size.sizeId)
    const changed = activeSize?.menuId !== menu.menuId || activeSize?.sizeId !== size.sizeId

    onChangeActiveSize({ menuId: menu.menuId, sizeId: size.sizeId })

    if (changed && quantity === 0) {
      onAdd({
        menuId: menu.menuId,
        menuName: menu.menuName,
        menuImage: menu.menuImage ?? null,
        sizeId: size.sizeId,
        sizeName: size.sizeName,
        price: size.price,
        quantity: 1
      })
    }
  }

  const handleIncrement = (size: MenuSize) => {
    onAdd({
      menuId: menu.menuId,
      menuName: menu.menuName,
      menuImage: menu.menuImage ?? null,
      sizeId: size.sizeId,
      sizeName: size.sizeName,
      price: size.price,
      quantity: 1
    })
  }

  const handleDecrement = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.menuId, size.sizeId)
    if (quantity <= 0) return
    if (quantity === 1) {
      if (activeSize?.menuId === menu.menuId && activeSize?.sizeId === size.sizeId) {
        onChangeActiveSize(null)
      }
    }
    onRemove(menu.menuId, size.sizeId)
  }

  return (
    <View
      className='rounded-2xl mb-3 border overflow-hidden'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        width: CARD_WIDTH
      }}
    >
      {/* Image Header */}
      <View style={{ width: '100%', height: 140, backgroundColor: `${colors.primary}10`, position: 'relative' }}>
        {menu.menuImage ? (
          <Image source={{ uri: menu.menuImage }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
          </View>
        )}
        {expandedBadgeSizeId && sizes && sizes.length > 0 && (
          <View className='absolute bottom-2 right-2'>
            <View
              className='flex-row items-center rounded-full'
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                gap: 8
              }}
            >
              {/* Decrement */}
              <TouchableOpacity
                onPress={() => {
                  const size = sizes.find((s) => s.sizeId === expandedBadgeSizeId)
                  if (size) handleDecrement(size)
                }}
                className='rounded-full'
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='remove' size={14} color='white' />
              </TouchableOpacity>
              {/* Quantity */}
              <Text className='text-sm font-bold text-white min-w-[24px] text-center'>
                {getQuantityReactive(menu.menuId, expandedBadgeSizeId)}
              </Text>
              {/* Increment */}
              <TouchableOpacity
                onPress={() => {
                  const size = sizes.find((s) => s.sizeId === expandedBadgeSizeId)
                  if (size) handleIncrement(size)
                }}
                className='rounded-full'
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='add' size={14} color='white' />
              </TouchableOpacity>
              {/* View Detail Button */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(protected)/order/item-detail',
                    params: { menuId: String(menu.menuId), sizeId: String(expandedBadgeSizeId) }
                  })
                }
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: 'rgba(255,255,255,0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.35)'
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Ionicons name='information-circle-outline' size={16} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Size Row */}
      {isLoading ? (
        <View className='p-3 items-center'>
          <ActivityIndicator color={colors.primary} size='small' />
        </View>
      ) : sizes && sizes.length > 0 ? (
        <View className='px-3 pt-3 pb-2'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row' style={{ gap: 8 }}>
              {sizes.map((size) => {
                const quantity = getQuantityReactive(menu.menuId, size.sizeId)

                const isSelected = activeSize?.menuId === menu.menuId && activeSize?.sizeId === size.sizeId
                return (
                  <TouchableOpacity
                    key={size.sizeId}
                    onPress={() => handleSizePress(size)}
                    className='px-3 py-2 rounded-lg'
                    style={{
                      backgroundColor: isSelected
                        ? `${colors.primary}30`
                        : quantity > 0
                          ? `${colors.primary}20`
                          : `${colors.primary}10`,
                      borderWidth: isSelected || quantity > 0 ? 1.5 : 1,
                      borderColor: isSelected || quantity > 0 ? colors.primary : 'transparent'
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Size và Quantity cùng hàng */}
                    <View className='flex-row items-center mb-1' style={{ gap: 6 }}>
                      <Text
                        className='text-sm font-bold'
                        style={{ color: isSelected || quantity > 0 ? colors.primary : colors.text }}
                      >
                        {size.sizeName}
                      </Text>
                      {quantity > 0 && (
                        <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.primary }}>
                          <Text className='text-xs font-bold text-white'>{quantity}</Text>
                        </View>
                      )}
                    </View>
                    {/* Price nằm dưới */}
                    <Text
                      className='text-xs font-bold'
                      style={{ color: isSelected || quantity > 0 ? colors.primary : colors.textSecondary }}
                    >
                      {formatCurrency(size.price)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>
      ) : null}

      {/* Name */}
      <View className='px-3 pb-3'>
        <Text className='text-base font-bold' style={{ color: colors.text }} numberOfLines={2}>
          {menu.menuName}
        </Text>
      </View>
    </View>
  )
}
