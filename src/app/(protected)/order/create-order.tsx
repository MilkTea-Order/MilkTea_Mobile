import { Header } from '@/components/layouts/Header'
import { MenuGroupNavV2 } from '@/components/molecules/MenuGroupNavV2'
import { MenuItemCardV2 } from '@/components/molecules/MenuItemCardV2'
import { useMenuGroupTypes, useMenusByGroup } from '@/features/order/menu/hooks/useMenu'
import type { MenuGroupType } from '@/features/order/menu/types/menu.type'
import { useOrderStore } from '@/features/order/store/order.store'
import { useTables } from '@/features/order/table/hooks/useTable'
import type { DinnerTable } from '@/features/order/table/types/table.type'
import { STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function CreateOrderScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ tableId?: string }>()
  const { colors } = useTheme()
  const orderItems = useOrderStore((s) => s.items)
  const orderAdd = useOrderStore((s) => s.add)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const clearOrder = useOrderStore((s) => s.clear)
  const totalPrice = useOrderStore((s) => s.totalPrice)

  const [selectedGroup, setSelectedGroup] = useState<MenuGroupType | null>(null)
  const [selectedTable, setSelectedTable] = useState<DinnerTable | null>(null)

  const {
    data: availableTables,
    isLoading: isLoadingTables,
    isRefetching: isRefetchingTables
  } = useTables(STATUS.DINNER_TABLE.AVAILABLE)
  const { data: menuGroups } = useMenuGroupTypes()
  const {
    data: menus,
    isLoading: isLoadingMenus,
    isRefetching: isRefetchingMenus,
    refetch: refetchMenus
  } = useMenusByGroup(selectedGroup?.MenuGroupID)

  const selectedTableId = Number(params.tableId ?? 0)

  useEffect(() => {
    if (!params.tableId) {
      router.replace('/(protected)/order/select-table')
    }
  }, [params.tableId, router])

  useEffect(() => {
    if (!selectedTableId || isLoadingTables || isRefetchingTables || !availableTables) {
      return
    }
    const matchedTable = availableTables.find((table) => table.tableID === selectedTableId)
    if (matchedTable) {
      setSelectedTable(matchedTable)
    } else {
      router.replace('/(protected)/order/select-table')
    }
  }, [availableTables, isLoadingTables, isRefetchingTables, selectedTableId, router])

  useEffect(() => {
    if (menuGroups && menuGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(menuGroups[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuGroups])

  const isNavigatingToReviewCart = useRef(false)

  // Chỉ clear store khi thực sự rời khỏi create-order flow (không phải khi đi đến review-cart)
  useFocusEffect(
    React.useCallback(() => {
      isNavigatingToReviewCart.current = false
      return () => {
        // Chỉ clear khi không phải đang đi đến review-cart
        if (!isNavigatingToReviewCart.current) {
          clearOrder()
          setSelectedTable(null)
          setSelectedGroup(null)
        }
      }
    }, [clearOrder])
  )

  const handleBack = () => {
    if (selectedGroup && menuGroups && menuGroups.length > 0) {
      // If not the first group, go back to first group
      if (selectedGroup.MenuGroupID !== menuGroups[0].MenuGroupID) {
        setSelectedGroup(menuGroups[0])
        return
      }
    }
    // Always go back to home when leaving create-order
    clearOrder()
    setSelectedTable(null)
    setSelectedGroup(null)
    router.replace('/(protected)/(tabs)' as any)
  }

  const subtitle = selectedTable ? `Bàn ${selectedTable.tableName}` : undefined

  if (isLoadingTables || isRefetchingTables) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Tạo đơn hàng' onBack={handleBack} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    )
  }

  if (!selectedTable) {
    return (
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <Header title='Tạo đơn hàng' onBack={handleBack} />
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-base text-center mb-4' style={{ color: colors.textSecondary }}>
            Bàn đã không còn khả dụng. Vui lòng chọn bàn khác.
          </Text>
          <TouchableOpacity
            onPress={() => {
              clearOrder()
              router.replace('/(protected)/order/select-table')
            }}
            className='px-4 py-3 rounded-xl'
            style={{ backgroundColor: colors.primary }}
          >
            <Text className='text-white font-semibold'>Chọn bàn khác</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <Header title='Tạo đơn hàng' subtitle={subtitle} onBack={handleBack} />

      {/* Menu Group Navigation */}
      {menuGroups && menuGroups.length > 0 && (
        <View style={{ backgroundColor: colors.background }}>
          <MenuGroupNavV2
            groups={menuGroups}
            selectedGroupId={selectedGroup?.MenuGroupID || null}
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
        ) : !selectedGroup ? (
          <View className='items-center py-8'>
            <Text className='text-base' style={{ color: colors.textSecondary }}>
              Vui lòng chọn nhóm món
            </Text>
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
              <View key={menu.MenuID} style={{ marginHorizontal: 4, marginBottom: 8 }}>
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
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* View Cart Button */}
      {orderItems.length > 0 && (
        <View
          className='border-t-2 px-5 py-4'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border
          }}
        >
          <TouchableOpacity
            onPress={() => {
              isNavigatingToReviewCart.current = true
              router.push({
                pathname: '/(protected)/order/review-cart',
                params: { tableId: String(selectedTable?.tableID || '') }
              })
            }}
            className='rounded-2xl py-4 flex-row items-center justify-center'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <Ionicons name='cart-outline' size={24} color='white' />
            <Text className='text-white text-center text-lg font-bold ml-2'>
              Xem giỏ hàng ({orderItems.reduce((sum, item) => sum + item.quantity, 0)})
            </Text>
            <Text className='text-white text-center text-lg font-bold ml-2'>• {formatCurrencyVND(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
