import { Header } from '@/components/layouts/Header'
import MenuGroupNavV2 from '@/components/molecules/MenuGroupNavV2'
import MenuItemCardV2 from '@/components/molecules/MenuItemCardV2'
import { useMenuGroupTypes, useMenusByGroup } from '@/features/order/hooks/useMenu'
import { useOrderStore } from '@/features/order/store/order.store'
import type { MenuGroupType } from '@/features/order/types/meny_catalog.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function SelectMenuScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [selectedGroup, setSelectedGroup] = useState<MenuGroupType | null>(null)
  const [activeSize, setActiveSize] = useState<{ menuId: number; sizeId: number } | null>(null)

  // Store
  const orderItems = useOrderStore((s) => s.items)
  const orderAdd = useOrderStore((s) => s.add)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const totalPrice = useOrderStore((s) => s.totalPrice)

  // Data fetching
  const { data: menuGroups } = useMenuGroupTypes()
  const {
    data: menus,
    isLoading: isLoadingMenus,
    isRefetching: isRefetchingMenus,
    refetch: refetchMenus
  } = useMenusByGroup(selectedGroup?.menuGroupId)

  const selectedTable = useOrderStore.getState().table

  useFocusEffect(
    React.useCallback(() => {
      if (!selectedTable) {
        router.replace('/(protected)/order/select-table')
      }
    }, [router, selectedTable])
  )

  useEffect(() => {
    if (menuGroups && menuGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(menuGroups[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuGroups])

  useEffect(() => {
    setActiveSize(null)
  }, [selectedGroup?.menuGroupId])

  const handleBack = () => {
    router.back()
  }

  if (!selectedTable) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Chọn món' onBack={handleBack} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    )
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title={`Chọn món •  ${selectedTable?.tableName ?? ''}`} onBack={handleBack} />

      {/* Menu Group Navigation */}
      {menuGroups && menuGroups.length > 0 && (
        <View style={{ backgroundColor: colors.background }}>
          <MenuGroupNavV2
            groups={menuGroups}
            selectedGroupId={selectedGroup?.menuGroupId || null}
            onSelectGroup={setSelectedGroup}
            colors={{
              card: colors.card,
              border: colors.border,
              text: colors.text,
              textSecondary: colors.textSecondary,
              primary: colors.primary,
              background: colors.background
            }}
          />
        </View>
      )}

      {/* Menu Items */}
      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {isLoadingMenus || isRefetchingMenus ? (
          <View className='py-8 items-center'>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !menus || menus.length === 0 ? (
          <View className='items-center py-8'>
            <Text className='text-base' style={{ color: colors.textSecondary }}>
              Nhóm này chưa có món khả dụng
            </Text>
            <TouchableOpacity
              onPress={() => refetchMenus()}
              className='mt-3 px-4 py-2 rounded-xl'
              style={{
                backgroundColor: `${colors.primary}15`,
                borderWidth: 1,
                borderColor: `${colors.primary}30`
              }}
            >
              <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                Thử lại
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className='flex-row flex-wrap' style={{ marginHorizontal: -4 }}>
            {menus.map((menu) => (
              <View key={menu.menuId} style={{ marginHorizontal: 4, marginBottom: 8 }}>
                <MenuItemCardV2
                  menu={menu}
                  colors={{
                    card: colors.card,
                    border: colors.border,
                    text: colors.text,
                    textSecondary: colors.textSecondary,
                    primary: colors.primary
                  }}
                  onAdd={orderAdd}
                  onRemove={orderDecrement}
                  formatCurrency={formatCurrencyVND}
                  activeSize={activeSize}
                  onChangeActiveSize={setActiveSize}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* View Cart Button */}
      {orderItems.length > 0 && (
        <View
          className='border-t-2 px-5 py-4 mb-2'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.push('/(protected)/order/review-cart')
            }}
            className='rounded-2xl py-4 flex-row items-center justify-between p-5'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <View className='flex-row items-center justify-between'>
              <Ionicons name='cart-outline' size={24} color='white' />
              <Text className='text-white text-center text-lg font-bold ml-2'>
                Giỏ hàng • {orderItems.reduce((sum, item) => sum + item.quantity, 0)} món
              </Text>
            </View>
            <Text className='text-white text-center text-lg font-bold ml-2'> {formatCurrencyVND(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
