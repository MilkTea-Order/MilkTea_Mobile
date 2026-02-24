import { Header } from '@/components/layouts/Header'
import MenuGroupNavV2 from '@/components/molecules/MenuGroupNavV2'
import MenuItemCardV2 from '@/components/molecules/MenuItemCardV2'
import { useMenuGroups, useMenusByGroup } from '@/features/order/hooks/useMenu'
import { useOrderStore } from '@/features/order/store/order.store'
import { MenuGroup } from '@/features/order/types/menu.type'
import { ORDER_FLOW_MODE } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDebounce } from 'use-debounce'

export default function SelectMenuScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | null>(null)
  const [activeSize, setActiveSize] = useState<{ menuId: number; sizeId: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 400)

  const normalizedSearch = debouncedSearch.trim().length >= 2 ? debouncedSearch.trim() : ''

  // Store
  const orderItems = useOrderStore((s) => s.items)
  const orderAdd = useOrderStore((s) => s.add)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const removeItem = useOrderStore((s) => s.removeItem)
  const totalPrice = useOrderStore((s) => s.totalPrice)
  const clearOrder = useOrderStore((s) => s.clear)
  const mode = useOrderStore((s) => s.mode)

  const { data: menuGroups } = useMenuGroups()
  const {
    data: menus,
    isLoading: isLoadingMenus,
    isRefetching: isRefetchingMenus,
    refetch: refetchMenus
  } = useMenusByGroup(selectedGroup?.id ?? undefined, normalizedSearch)

  const selectedTable = useOrderStore((s) => s.table)

  useFocusEffect(
    useCallback(() => {
      if (!selectedTable) {
        router.replace('/(protected)/order/select-table')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])
  )
  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveSize(null)
      }
    }, [])
  )

  useEffect(() => {
    setActiveSize(null)
  }, [selectedGroup?.id])

  const handleBack = () => {
    if (mode === ORDER_FLOW_MODE.ADD_ITEMS) {
      clearOrder()
    }
    router.back()
  }

  const handleToggleGroup = (group: MenuGroup) => {
    if (selectedGroup?.id === group.id) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
    }
  }

  const handleDecrement = (menuId: number, sizeId: number) => {
    const item = orderItems.find((x) => x.menuId === menuId && x.sizeId === sizeId)
    if (!item) return

    if (item.quantity === 1) {
      Alert.alert('Xác nhận', 'Bạn có muốn xóa món này khỏi giỏ hàng?', [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            removeItem(menuId, sizeId)
            if (activeSize?.menuId === menuId && activeSize?.sizeId === sizeId) {
              setActiveSize(null)
            }
          }
        }
      ])
      return
    }
    orderDecrement(menuId, sizeId)
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
      <Header title={`Chọn món •  ${selectedTable?.name ?? ''}`} onBack={handleBack}>
        <View
          className='flex-row items-center px-4 py-3 rounded-2xl mx-3 mb-3'
          style={{
            backgroundColor: colors.card,
            borderWidth: 1.5,
            borderColor: colors.border,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          <Ionicons name='search' size={20} color={colors.primary} />
          <TextInput
            placeholder='Tìm kiếm món ăn...'
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className='flex-1 ml-3 text-base'
            style={{ color: colors.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className='p-1'>
              <Ionicons name='close-circle-sharp' size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </Header>

      {/* Menu Group Navigation */}
      {menuGroups && menuGroups.length > 0 && (
        <View style={{ backgroundColor: colors.background }}>
          <MenuGroupNavV2
            groups={menuGroups}
            selectedGroupId={selectedGroup?.id || null}
            onSelectGroup={handleToggleGroup}
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

      {!(selectedGroup?.id != null || normalizedSearch.length > 0) ? (
        <View className='items-center py-10 px-6'>
          <Ionicons name='options-outline' size={28} color={colors.textSecondary} />
          <Text className='text-base font-semibold mt-3' style={{ color: colors.text }}>
            Chọn tiêu chí tìm kiếm
          </Text>
          <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
            Hãy chọn một nhóm món ở phía trên hoặc nhập ít nhất 2 ký tự để tìm theo tên.
          </Text>
        </View>
      ) : isLoadingMenus || isRefetchingMenus ? (
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
        //   <View className='flex-row flex-wrap' style={{ marginHorizontal: -4 }}>
        //     {menus.map((menu) => (
        //       <View key={menu.id} style={{ marginHorizontal: 4, marginBottom: 8 }}>
        //         <MenuItemCardV2
        //           menu={menu}
        //           colors={{
        //             card: colors.card,
        //             border: colors.border,
        //             text: colors.text,
        //             textSecondary: colors.textSecondary,
        //             primary: colors.primary
        //           }}
        //           onAdd={orderAdd}
        //           onRemove={handleDecrement}
        //           formatCurrency={formatCurrencyVND}
        //           activeSize={activeSize}
        //           onChangeActiveSize={setActiveSize}
        //         />
        //       </View>
        //     ))}
        //   </View>
        <FlatList
          data={menus}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item: menu }) => (
            <View style={{ flex: 1 }}>
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
                onRemove={handleDecrement}
                formatCurrency={formatCurrencyVND}
                activeSize={activeSize}
                onChangeActiveSize={setActiveSize}
              />
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}

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
                Giỏ hàng • {orderItems.reduce((sum, item) => sum + item.quantity, 0)}món
              </Text>
            </View>
            <Text className='text-white text-center text-lg font-bold ml-2'> {formatCurrencyVND(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
