import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ReportScreen() {
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const reportItems = [
    {
      title: 'Báo cáo tồn kho',
      description: 'Theo dõi số lượng nguyên vật liệu còn lại',
      icon: 'cube-outline',
      iconType: 'ion',
      color: colors.primary,
      onPress: () => router.push('/report/inventory-report')
    },
    {
      title: 'Báo cáo doanh thu',
      description: 'Xem doanh thu theo ngày, phương thức thanh toán',
      icon: 'cash-multiple',
      iconType: 'material',
      color: '#22c55e',
      onPress: () => router.push('/report/revenue-report')
    },
    {
      title: 'Quản lý thu chi',
      description: 'Theo dõi tiền chi, tiền thu theo ngày',
      icon: 'wallet-outline',
      iconType: 'ion',
      color: '#f59e0b',
      onPress: () => router.push('/report/expense-report')
    }
  ]

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20
        }}
      >
        <Text className='text-white text-2xl font-bold text-center mt-2'>Báo cáo</Text>
      </LinearGradient>

      <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Report Cards */}
        <View className='px-6 mt-6 gap-4'>
          {reportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.85}
              className='rounded-3xl p-5'
              style={{
                backgroundColor: colors.card,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 6,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <View className='flex-row items-center'>
                {/* Icon */}
                <View
                  className='w-14 h-14 rounded-2xl items-center justify-center mr-4'
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  {item.iconType === 'ion' ? (
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                  ) : (
                    <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
                  )}
                </View>

                {/* Content */}
                <View className='flex-1'>
                  <Text className='text-base font-semibold mb-1' style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  <Text className='text-sm' style={{ color: colors.textSecondary }}>
                    {item.description}
                  </Text>
                </View>

                {/* Arrow */}
                <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Optional future: quick stats */}
        {/* <View className='px-6 mt-6'>
          <View className='rounded-2xl p-4' style={{ backgroundColor: colors.card }}>
            <Text style={{ color: colors.text }}>Coming soon...</Text>
          </View>
        </View> */}
      </ScrollView>
    </View>
  )
}
