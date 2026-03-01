import { useMenuSizes } from '@/features/order/hooks/useMenu'
import { useOrderStore, type OrderLine } from '@/features/order/store/order.store'
import type { Menu, MenuSize } from '@/features/order/types/menu.type'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2

type Props = {
  menu: Menu
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
  isActive?: boolean
  onPressCard?: () => void
}

export default function MenuItemCardV2({
  menu,
  colors,
  onAdd,
  onRemove,
  formatCurrency,
  activeSize,
  onChangeActiveSize,
  isActive,
  onPressCard
}: Props) {
  const { data: sizes, isLoading } = useMenuSizes(menu.id)
  const orderItems = useOrderStore((s) => s.items)
  const getQuantityReactive = (menuId: number, sizeId: number) => {
    return orderItems.find((item) => item.menuId === menuId && item.sizeId === sizeId)?.quantity ?? 0
  }
  const expandedBadgeSizeId = activeSize?.menuId === menu.id && activeSize?.sizeId ? activeSize?.sizeId : null

  const handleSizePress = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.id, size.id)
    const changed = activeSize?.menuId !== menu.id || activeSize?.sizeId !== size.id

    onChangeActiveSize({ menuId: menu.id, sizeId: size.id })

    if (changed && quantity === 0) {
      handleIncrement(size)
    }
  }

  const handleIncrement = (size: MenuSize) => {
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

  const handleDecrement = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.id, size.id)
    if (quantity <= 0) return
    if (quantity === 1) {
      if (activeSize?.menuId === menu.id && activeSize?.sizeId === size.id) {
        onChangeActiveSize(null)
      }
    }
    onRemove(menu.id, size.id)
  }

  return (
    <View
      className='rounded-2xl mb-3 border overflow-hidden'
      style={{
        backgroundColor: colors.card,
        borderColor: isActive ? colors.primary : colors.border,
        borderWidth: isActive ? 2 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.15 : 0.07,
        shadowRadius: isActive ? 12 : 8,
        elevation: isActive ? 4 : 2,
        width: CARD_WIDTH
      }}
    >
      {/* Image Header */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPressCard} disabled={!onPressCard} style={{ width: '100%' }}>
        <View style={{ width: '100%', height: 140, backgroundColor: `${colors.primary}10`, position: 'relative' }}>
          {menu.image ? (
            <Image source={{ uri: menu.image }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
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
                    const size = sizes.find((s) => s.id === expandedBadgeSizeId)
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
                  {getQuantityReactive(menu.id, expandedBadgeSizeId)}
                </Text>
                {/* Increment */}
                <TouchableOpacity
                  onPress={() => {
                    const size = sizes.find((s) => s.id === expandedBadgeSizeId)
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
                      params: { menuId: String(menu.id), sizeId: String(expandedBadgeSizeId) }
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
      </TouchableOpacity>

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
                const quantity = getQuantityReactive(menu.id, size.id)
                const isSelected = activeSize?.menuId === menu.id && activeSize?.sizeId === size.id
                return (
                  <TouchableOpacity
                    key={size.id}
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
                    {/* Size và Quantity */}
                    <View className='flex-row items-center mb-1' style={{ gap: 6 }}>
                      <Text
                        className='text-sm font-bold'
                        style={{ color: isSelected || quantity > 0 ? colors.primary : colors.text }}
                      >
                        {size.name}
                      </Text>
                      {quantity > 0 && (
                        <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.primary }}>
                          <Text className='text-xs font-bold text-white'>{quantity}</Text>
                        </View>
                      )}
                    </View>
                    {/* Price */}
                    <Text
                      className='text-xs font-bold'
                      style={{ color: isSelected || quantity > 0 ? colors.primary : colors.textSecondary }}
                    >
                      {formatCurrency(size.price?.price ?? 0)}
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
          {menu.name}
        </Text>
      </View>
    </View>
  )
}
