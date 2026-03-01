import { Header } from '@/components/layouts/Header'
import MenuGroupNavV2 from '@/components/molecules/MenuGroupNavV2'
import MenuItemCardV2 from '@/components/molecules/MenuItemCardV2'
import { useMenuGroups, useMenusByGroupAndName } from '@/features/order/hooks/useMenu'
import { useOrderStore } from '@/features/order/store/order.store'
import { MenuGroup } from '@/features/order/types/menu.type'
import { ORDER_FLOW_MODE, OrderFlowMode } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

export default function SelectMenuScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const { mode, orderId } = useLocalSearchParams<{
    mode?: OrderFlowMode
    orderId?: string
  }>()

  const modeValue = mode ?? ORDER_FLOW_MODE.CREATE

  const [selectedGroup, setSelectedGroup] = useState<MenuGroup | null>(null)
  const [activeSize, setActiveSize] = useState<{ menuId: number; sizeId: number } | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  // Search Menu by name
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')

  // Store
  const orderItems = useOrderStore((s) => s.items)
  const orderAdd = useOrderStore((s) => s.add)
  const orderDecrement = useOrderStore((s) => s.decrement)
  const removeItem = useOrderStore((s) => s.removeItem)
  const totalPrice = useOrderStore((s) => s.totalPrice)
  const clearOrder = useOrderStore((s) => s.clear)
  const clearCart = useOrderStore((s) => s.clearCart)
  const selectedTable = useOrderStore((s) => s.table)

  const { data: menuGroups } = useMenuGroups()
  const {
    data: menus,
    isLoading: isLoadingMenus,
    isRefetching: isRefetchingMenus,
    refetch: refetchMenus
  } = useMenusByGroupAndName(selectedGroup?.id, submittedSearch)

  // If hadn't selected table, redirect to select table screen
  useFocusEffect(
    useCallback(() => {
      if (!selectedTable) {
        router.replace('/(protected)/order/select-table')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])
  )

  // Clear active size when unmount
  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveSize(null)
        setActiveMenuId(null)
      }
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      if (modeValue === ORDER_FLOW_MODE.ADD_ITEMS && !Number.isFinite(Number(orderId))) {
        clearOrder()
        Alert.alert('Lỗi', 'Không tìm thấy đơn hàng.')
        router.dismissAll()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, modeValue])
  )

  // Clear active size when change group
  useEffect(() => {
    setActiveSize(null)
    setActiveMenuId(null)
  }, [selectedGroup?.id])

  // Handle back button
  const handleBack = () => {
    clearOrder()
    router.back()
  }

  // Handle change table
  const handleChangeTable = () => {
    router.replace('/(protected)/order/select-table')
  }

  // Handle clear cart
  const handleClearCart = () => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xóa tất cả',
        style: 'destructive',
        onPress: () => {
          clearCart()
          setActiveSize(null)
          setActiveMenuId(null)
        }
      }
    ])
  }

  const hasItemsInCart = orderItems.length > 0

  // Handle toggle group
  const handleToggleGroup = (group: MenuGroup) => {
    if (selectedGroup?.id === group.id) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
    }
  }

  // Handle search
  const handleSearch = () => {
    const trimmed = searchQuery.trim()
    setSubmittedSearch(trimmed.length >= 2 ? trimmed : '')
    Keyboard.dismiss()
  }

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('')
    setSubmittedSearch('')
  }

  // Handle decrement item
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

  // If hadn't selected table, show loading
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
      <Header
        title={`${selectedTable?.name ?? ''}`}
        onBack={handleBack}
        rightContent={
          <View className='flex-row items-center gap-1'>
            {modeValue === ORDER_FLOW_MODE.CREATE && (
              <TouchableOpacity
                onPress={handleChangeTable}
                className='bg-white/20 rounded-full p-2'
                activeOpacity={0.7}
              >
                <Ionicons name='swap-horizontal' size={18} color='white' />
              </TouchableOpacity>
            )}
            {hasItemsInCart && (
              <TouchableOpacity onPress={handleClearCart} className='bg-white/20 rounded-full p-2' activeOpacity={0.7}>
                <Ionicons name='trash-outline' size={18} color='white' />
              </TouchableOpacity>
            )}
          </View>
        }
      >
        <View
          className='flex-row items-center px-4 rounded-2xl mx-3 mb-3'
          style={{
            height: 48,
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
          <TextInput
            placeholder='Tìm kiếm món ăn'
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType='search'
            className='flex-1 ml-3 text-base'
            style={{
              color: colors.text,
              paddingVertical: 0,
              textAlignVertical: 'center'
            }}
          />

          {searchQuery.length > 0 ? (
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity onPress={handleClearSearch} style={{ justifyContent: 'center' }}>
                <Ionicons name='close-circle-sharp' size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ) : null}
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
      {!(selectedGroup?.id != null || submittedSearch.length > 0) ? (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View className='items-center py-10 px-6 flex-1'>
            <Ionicons name='options-outline' size={28} color={colors.textSecondary} />
            <Text className='text-base font-semibold mt-3' style={{ color: colors.text }}>
              Chọn tiêu chí tìm kiếm
            </Text>
            <Text className='text-sm mt-2 text-center' style={{ color: colors.textSecondary }}>
              Hãy chọn một nhóm món ở phía trên hoặc nhập ít nhất 2 ký tự để tìm theo tên.
            </Text>
          </View>
        </Pressable>
      ) : isLoadingMenus || isRefetchingMenus ? (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View className='items-center py-10 px-6 flex-1'>
            <ActivityIndicator color={colors.primary} />
          </View>
        </Pressable>
      ) : !menus || menus.length === 0 ? (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View className='items-center py-10 px-6 flex-1'>
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
        </Pressable>
      ) : (
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
                isActive={activeMenuId === menu.id}
                onPressCard={() => {
                  setActiveMenuId(menu.id)

                  // const firstSizeWithQuantity = menu.size?.find((size) => {
                  //   return orderItems.some((item) => item.sizeId === size.id && item.quantity > 0)
                  // })

                  // if (firstSizeWithQuantity) {
                  //   setActiveSize({ menuId: menu.id, sizeId: firstSizeWithQuantity.id })
                  // }
                }}
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
              router.push({
                pathname: '/(protected)/order/review-cart',
                params: {
                  mode: modeValue,
                  orderId: String(orderId)
                }
              })
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
