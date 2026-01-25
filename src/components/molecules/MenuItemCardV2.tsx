import { useMenuSizes } from '@/features/order/hooks/useMenu'
import { useOrderStore } from '@/features/order/store/order.store'
import type { MenuItem, MenuSize } from '@/features/order/types/menu.type'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2

type OnAdd = (menu: MenuItem, size: MenuSize) => void
type OnRemove = (menuId: number, sizeId: number) => void

type Props = {
  menu: MenuItem
  colors: {
    card: string
    border: string
    text: string
    textSecondary: string
    primary: string
  }
  onAdd: OnAdd
  onRemove: OnRemove
  formatCurrency: (amount: number) => string
}

export default function MenuItemCardV2({ menu, colors, onAdd, onRemove, formatCurrency }: Props) {
  const [expandedBadge, setExpandedBadge] = useState<number | null>(null) // sizeId của badge đang mở rộng
  const [selectedSizeForPrice, setSelectedSizeForPrice] = useState<MenuSize | null>(null) // size được chọn để hiển thị giá
  const { data: sizes, isLoading } = useMenuSizes(menu.menuId)

  const orderItems = useOrderStore((s) => s.items)
  const getQuantityReactive = (menuId: number, sizeId: number) => {
    return orderItems.find((item) => item.menuId === menuId && item.sizeId === sizeId)?.quantity ?? 0
  }

  const imageUrl = (menu as any).MenuImage || null

  //Làn đầu tiên thì tăng quantity nhưng lần sau chỉ cần mở badge
  const handleSizePress = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.menuId, size.sizeId)
    setSelectedSizeForPrice(size)
    setExpandedBadge(size.sizeId)
    if (selectedSizeForPrice?.sizeId !== size.sizeId && quantity === 0) {
      onAdd(menu, size)
    }
  }

  const handleIncrement = (size: MenuSize) => {
    onAdd(menu, size)
  }

  const handleDecrement = (size: MenuSize) => {
    const quantity = getQuantityReactive(menu.menuId, size.sizeId)
    if (quantity <= 0) return
    if (quantity === 1) {
      setExpandedBadge(null)
      setSelectedSizeForPrice(null)
    }
    onRemove(menu.menuId, size.sizeId)
  }

  const handleRemoveSize = (size: MenuSize) => {
    // Xóa tất cả quantity của size này
    const quantity = getQuantityReactive(menu.menuId, size.sizeId)
    for (let i = 0; i < quantity; i++) {
      onRemove(menu.menuId, size.sizeId)
    }
    setExpandedBadge(null)
    setSelectedSizeForPrice(null)
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
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
          </View>
        )}
        {/* Quantity Badge - chỉ hiển thị khi có size nào đó có quantity > 0 */}
        {sizes && sizes.length > 0 && sizes.some((s) => getQuantityReactive(menu.menuId, s.sizeId) > 0) && (
          <View className='absolute bottom-2 right-2'>
            {expandedBadge ? (
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
                    const size = sizes.find((s) => s.sizeId === expandedBadge)
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
                  {expandedBadge ? getQuantityReactive(menu.menuId, expandedBadge) : 0}
                </Text>
                {/* Increment */}
                <TouchableOpacity
                  onPress={() => {
                    const size = sizes.find((s) => s.sizeId === expandedBadge)
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
                {/* Remove Size Button */}
                <TouchableOpacity
                  onPress={() => {
                    const size = sizes.find((s) => s.sizeId === expandedBadge)
                    if (size) handleRemoveSize(size)
                  }}
                  className='rounded-full'
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: 'rgba(255,0,0,0.7)',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name='close' size={14} color='white' />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  // Tìm size đầu tiên có quantity > 0
                  const sizeWithQuantity = sizes.find((s) => getQuantityReactive(menu.menuId, s.sizeId) > 0)
                  if (sizeWithQuantity) {
                    setExpandedBadge(sizeWithQuantity.sizeId)
                    setSelectedSizeForPrice(sizeWithQuantity)
                  }
                }}
                className='rounded-full'
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='options-outline' size={18} color='white' />
              </TouchableOpacity>
            )}
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

                const isSelected = selectedSizeForPrice?.sizeId === size.sizeId
                return (
                  <TouchableOpacity
                    key={size.sizeId}
                    onPress={() => handleSizePress(size)}
                    className='px-3 py-1.5 rounded-lg flex-row items-center'
                    style={{
                      backgroundColor: isSelected
                        ? `${colors.primary}30`
                        : quantity > 0
                          ? `${colors.primary}20`
                          : `${colors.primary}10`,
                      borderWidth: isSelected || quantity > 0 ? 1.5 : 1,
                      borderColor: isSelected || quantity > 0 ? colors.primary : 'transparent',
                      gap: 6
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      className='text-xs font-semibold'
                      style={{ color: isSelected || quantity > 0 ? colors.primary : colors.text }}
                    >
                      {size.sizeName}
                    </Text>
                    {quantity > 0 && (
                      <View className='rounded-full px-1.5 py-0.5' style={{ backgroundColor: colors.primary }}>
                        <Text className='text-xs font-bold text-white'>{quantity}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>
      ) : null}

      {/* Name and Price */}
      <View className='px-3 pb-3'>
        <Text className='text-base font-bold mb-2' style={{ color: colors.text }} numberOfLines={2}>
          {menu.menuName}
        </Text>
        {sizes && sizes.length > 0 && (
          <View>
            {sizes.map((size, index) => (
              <View key={size.sizeId} className='flex-row items-center mb-1'>
                <Text className='text-xs font-semibold mr-2' style={{ color: colors.textSecondary, minWidth: 40 }}>
                  {size.sizeName}:
                </Text>
                <Text className='text-sm font-bold' style={{ color: colors.primary }}>
                  {formatCurrency(size.price)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
