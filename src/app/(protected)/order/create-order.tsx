import { Header } from '@/components/layouts/Header'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

// Mock data structure: Group Type Category → Type Category → Item
interface ProductItem {
  id: string
  name: string
  price: number
  image?: string
  description?: string
}

interface TypeCategory {
  id: string
  name: string
  items: ProductItem[]
}

interface GroupTypeCategory {
  id: string
  name: string
  icon: string
  typeCategories: TypeCategory[]
}

const mockData: GroupTypeCategory[] = [
  {
    id: '1',
    name: 'Trà sữa',
    icon: 'cafe-outline',
    typeCategories: [
      {
        id: '1-1',
        name: 'Trà sữa truyền thống',
        items: [
          { id: '1-1-1', name: 'Trà sữa đen', price: 35000, description: 'Trà đen + sữa tươi' },
          { id: '1-1-2', name: 'Trà sữa trắng', price: 35000, description: 'Trà xanh + sữa tươi' },
          { id: '1-1-3', name: 'Trà sữa thái xanh', price: 40000, description: 'Trà thái xanh đặc biệt' }
        ]
      },
      {
        id: '1-2',
        name: 'Trà sữa vị đặc biệt',
        items: [
          { id: '1-2-1', name: 'Trà sữa matcha', price: 45000, description: 'Matcha Nhật Bản' },
          { id: '1-2-2', name: 'Trà sữa oolong', price: 40000, description: 'Trà oolong thơm ngon' },
          { id: '1-2-3', name: 'Trà sữa đào', price: 40000, description: 'Vị đào tươi mát' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Topping',
    icon: 'ice-cream-outline',
    typeCategories: [
      {
        id: '2-1',
        name: 'Trân châu',
        items: [
          { id: '2-1-1', name: 'Trân châu đen', price: 10000 },
          { id: '2-1-2', name: 'Trân châu trắng', price: 10000 },
          { id: '2-1-3', name: 'Trân châu sợi', price: 12000 }
        ]
      },
      {
        id: '2-2',
        name: 'Thạch & Kem',
        items: [
          { id: '2-2-1', name: 'Thạch dừa', price: 10000 },
          { id: '2-2-2', name: 'Kem cheese', price: 15000 },
          { id: '2-2-3', name: 'Kem vani', price: 12000 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Đồ uống khác',
    icon: 'water-outline',
    typeCategories: [
      {
        id: '3-1',
        name: 'Nước ép',
        items: [
          { id: '3-1-1', name: 'Nước ép cam', price: 30000 },
          { id: '3-1-2', name: 'Nước ép dưa hấu', price: 30000 },
          { id: '3-1-3', name: 'Nước ép táo', price: 30000 }
        ]
      },
      {
        id: '3-2',
        name: 'Sinh tố',
        items: [
          { id: '3-2-1', name: 'Sinh tố bơ', price: 40000 },
          { id: '3-2-2', name: 'Sinh tố dâu', price: 40000 },
          { id: '3-2-3', name: 'Sinh tố xoài', price: 40000 }
        ]
      }
    ]
  }
]

interface CartItem extends ProductItem {
  quantity: number
}

export default function CreateOrderScreen() {
  const router = useRouter()
  const { colors } = useTheme()

  const [selectedGroup, setSelectedGroup] = useState<GroupTypeCategory | null>(null)
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<TypeCategory | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const addToCart = (item: ProductItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((cartItem) => cartItem.id === itemId)
      if (item && item.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
      }
      return prevCart.filter((cartItem) => cartItem.id !== itemId)
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleBack = () => {
    if (selectedTypeCategory) {
      // Nếu đang ở màn hình items → quay lại type categories
      setSelectedTypeCategory(null)
    } else if (selectedGroup) {
      // Nếu đang ở màn hình type categories → quay lại group selection
      setSelectedGroup(null)
    } else {
      router.back()
    }
  }

  const getSubtitle = () => {
    if (selectedTypeCategory) {
      return `${selectedGroup?.name} • ${selectedTypeCategory.name}`
    }
    if (selectedGroup) {
      return selectedGroup.name
    }
    return undefined
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Header title='Tạo đơn hàng' subtitle={getSubtitle()} onBack={handleBack} />

      {/* Main Content */}
      <ScrollView
        className='flex-1'
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16 }}
      >
        {!selectedGroup ? (
          // Show all groups
          <View>
            <Text className='text-2xl font-bold mb-2' style={{ color: colors.text }}>
              Chọn danh mục sản phẩm
            </Text>
            <Text className='text-sm mb-6' style={{ color: colors.textSecondary }}>
              Chọn nhóm sản phẩm để bắt đầu tạo đơn
            </Text>
            <View className='flex-row flex-wrap gap-3'>
              {mockData.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => setSelectedGroup(group)}
                  className='rounded-3xl p-6 border-2'
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    width: '48%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                  }}
                  activeOpacity={0.8}
                >
                  <View className='rounded-2xl p-4 mb-3 self-start' style={{ backgroundColor: `${colors.primary}20` }}>
                    <Ionicons name={group.icon as any} size={32} color={colors.primary} />
                  </View>
                  <Text className='text-lg font-bold mb-1' style={{ color: colors.text }}>
                    {group.name}
                  </Text>
                  <Text className='text-sm' style={{ color: colors.textSecondary }}>
                    {group.typeCategories.length} loại
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : !selectedTypeCategory ? (
          // Show Type Categories
          <View>
            <View className='flex-row items-center justify-between mb-5'>
              <View className='flex-1 mr-3'>
                <Text className='text-2xl font-bold mb-1' style={{ color: colors.text }}>
                  {selectedGroup.name}
                </Text>
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  Chọn loại sản phẩm
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedGroup(null)}
                className='px-4 py-2.5 rounded-xl'
                style={{
                  backgroundColor: `${colors.primary}15`,
                  borderWidth: 1,
                  borderColor: `${colors.primary}30`
                }}
                activeOpacity={0.7}
              >
                <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                  Đổi nhóm
                </Text>
              </TouchableOpacity>
            </View>
            {selectedGroup.typeCategories.map((typeCategory) => (
              <TouchableOpacity
                key={typeCategory.id}
                onPress={() => setSelectedTypeCategory(typeCategory)}
                className='rounded-2xl p-5 mb-3 border-2'
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                  elevation: 3
                }}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1 mr-3'>
                    <Text className='text-lg font-bold mb-2' style={{ color: colors.text }}>
                      {typeCategory.name}
                    </Text>
                    <View className='flex-row items-center'>
                      <Ionicons name='cube-outline' size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                      <Text className='text-sm' style={{ color: colors.textSecondary }}>
                        {typeCategory.items.length} sản phẩm
                      </Text>
                    </View>
                  </View>
                  <View className='rounded-full p-2' style={{ backgroundColor: `${colors.primary}15` }}>
                    <Ionicons name='chevron-forward' size={20} color={colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Show Items
          <View>
            <View className='flex-row items-center justify-between mb-5'>
              <View className='flex-1 mr-3'>
                <Text className='text-2xl font-bold mb-1' style={{ color: colors.text }}>
                  {selectedTypeCategory.name}
                </Text>
                <Text className='text-sm' style={{ color: colors.textSecondary }}>
                  {selectedGroup.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedTypeCategory(null)}
                className='px-4 py-2.5 rounded-xl'
                style={{
                  backgroundColor: `${colors.primary}15`,
                  borderWidth: 1,
                  borderColor: `${colors.primary}30`
                }}
                activeOpacity={0.7}
              >
                <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                  Quay lại
                </Text>
              </TouchableOpacity>
            </View>
            {selectedTypeCategory.items.map((item) => {
              const cartItem = cart.find((c) => c.id === item.id)
              const quantity = cartItem?.quantity || 0

              return (
                <View
                  key={item.id}
                  className='rounded-2xl p-5 mb-3 border-2'
                  style={{
                    backgroundColor: colors.card,
                    borderColor: quantity > 0 ? colors.primary : colors.border,
                    borderWidth: quantity > 0 ? 2 : 1.5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: quantity > 0 ? 4 : 2 },
                    shadowOpacity: quantity > 0 ? 0.12 : 0.06,
                    shadowRadius: quantity > 0 ? 12 : 8,
                    elevation: quantity > 0 ? 4 : 2
                  }}
                >
                  <View className='flex-row items-start justify-between'>
                    <View className='flex-1 mr-3'>
                      <Text className='text-lg font-bold mb-1' style={{ color: colors.text }}>
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text className='text-sm mb-2' style={{ color: colors.textSecondary }}>
                          {item.description}
                        </Text>
                      )}
                      <Text className='text-lg font-bold' style={{ color: colors.primary }}>
                        {formatCurrency(item.price)}
                      </Text>
                    </View>
                    {quantity > 0 ? (
                      <View
                        className='flex-row items-center rounded-full px-3 py-2'
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                          className='rounded-full p-1.5'
                          style={{ backgroundColor: colors.primary }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name='remove' size={18} color='white' />
                        </TouchableOpacity>
                        <Text
                          className='text-lg font-bold mx-4 min-w-[24px] text-center'
                          style={{ color: colors.primary }}
                        >
                          {quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => addToCart(item)}
                          className='rounded-full p-1.5'
                          style={{ backgroundColor: colors.primary }}
                          activeOpacity={0.8}
                        >
                          <Ionicons name='add' size={18} color='white' />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        className='rounded-full p-3.5'
                        style={{
                          backgroundColor: colors.primary,
                          shadowColor: colors.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 3
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name='add' size={22} color='white' />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <View
          className='border-t-2 px-5 py-4'
          style={{
            backgroundColor: colors.card,
            borderTopColor: colors.border
          }}
        >
          <View className='flex-row items-center justify-between mb-3'>
            <View className='flex-row items-center'>
              <Ionicons name='cart-outline' size={24} color={colors.primary} />
              <Text className='text-lg font-bold ml-2' style={{ color: colors.text }}>
                Giỏ hàng ({cart.length} món)
              </Text>
            </View>
            <Text className='text-xl font-bold' style={{ color: colors.primary }}>
              {formatCurrency(getTotalPrice())}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-3'>
            {cart.map((item) => (
              <View
                key={item.id}
                className='rounded-xl px-3 py-2 mr-2 flex-row items-center'
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Text className='text-sm font-semibold mr-2' style={{ color: colors.text }}>
                  {item.name}
                </Text>
                <View className='flex-row items-center'>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.id)}
                    className='rounded-full p-1'
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Ionicons name='remove' size={12} color='white' />
                  </TouchableOpacity>
                  <Text className='text-sm font-bold mx-2' style={{ color: colors.primary }}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    className='rounded-full p-1'
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Ionicons name='add' size={12} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            className='rounded-2xl py-4'
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
            onPress={() => {
              // Handle checkout
            }}
          >
            <Text className='text-white text-center text-lg font-bold'>Tạo đơn hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
