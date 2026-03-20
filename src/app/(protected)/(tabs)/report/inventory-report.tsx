import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { useInventoryReport } from '@/features/report/hooks/useReport'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrency } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function InventoryScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

  const { inventory = [], isLoading, isFetching, isRefetching, refetch } = useInventoryReport()

  const data = useMemo(() => inventory, [inventory])

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    )
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* HEADER */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className='absolute bg-white/20 rounded-full p-2'
          style={{
            top: insets.top + 16,
            left: 20,
            zIndex: 10
          }}
        >
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>

        <Text className='text-white text-2xl font-bold text-center mt-2'>Báo cáo tồn kho</Text>
      </LinearGradient>

      {/* CONTENT */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
          flexGrow: 1 // 🔥 để empty center đẹp
        }}
        // 🔥 Pull to refresh
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
              marginTop: 40
            }}
          >
            {isFetching ? (
              <ActivityIndicator size='small' color={colors.primary} />
            ) : (
              <>
                {/* ICON */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.primary + '15',
                    marginBottom: 16
                  }}
                >
                  <Ionicons name='cube-outline' size={28} color={colors.primary} />
                </View>

                {/* TITLE */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 6
                  }}
                >
                  Chưa có dữ liệu
                </Text>

                {/* DESCRIPTION */}
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    lineHeight: 18
                  }}
                >
                  Hiện chưa có dữ liệu tồn kho.
                  {'\n'}Hãy thử kéo xuống để tải lại.
                </Text>
              </>
            )}
          </View>
        }
        renderItem={({ item: group }) => (
          <CollapsibleSection title={group.name} icon='cube-outline'>
            <View className='gap-3'>
              {group.materialItems.map((item) => {
                const total = item.unitMin.quantity * item.latestPriceImport

                return (
                  <View
                    key={item.id}
                    className='rounded-2xl p-4'
                    style={{
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border
                    }}
                  >
                    {/* NAME */}
                    <View className='flex-row justify-between items-center mb-2'>
                      <View className='flex-1 gap-2 flex-row items-center'>
                        <Text className='font-bold text-base' style={{ color: colors.text }}>
                          {item.name}
                        </Text>

                        <Text className='text-xs' style={{ color: colors.textSecondary }}>
                          {item.styleQuantity} {item.unitMin.name}/{item.unitMax.name}
                        </Text>
                      </View>

                      {/* STATUS */}
                      <View
                        className='px-2 py-1 rounded-lg'
                        style={{
                          backgroundColor: item.status.id === 1 ? colors.primary + '20' : '#99999920'
                        }}
                      >
                        <Text
                          className='text-xs font-semibold'
                          style={{
                            color: item.status.id === 1 ? colors.primary : '#999'
                          }}
                        >
                          {item.status.name}
                        </Text>
                      </View>
                    </View>

                    {/* DATA */}
                    <View className='flex-row justify-between mb-1'>
                      <Text style={{ color: colors.textSecondary }}>Tồn (nhỏ)</Text>
                      <Text style={{ color: colors.text }}>
                        {item.unitMin.quantity.toFixed(2)} {item.unitMin.name}
                      </Text>
                    </View>

                    <View className='flex-row justify-between mb-1'>
                      <Text style={{ color: colors.textSecondary }}>Tồn (lớn)</Text>
                      <Text style={{ color: colors.text }}>
                        {item.unitMax.quantity.toFixed(2)} {item.unitMax.name}
                      </Text>
                    </View>

                    <View className='flex-row justify-between mb-1'>
                      <Text style={{ color: colors.textSecondary }}>Giá nhập gần nhất</Text>
                      <Text style={{ color: colors.text }}>{formatCurrency(item.latestPriceImport)}</Text>
                    </View>

                    {/* TOTAL */}
                    <View
                      className='flex-row justify-between mt-2 pt-2 border-t'
                      style={{ borderColor: colors.border }}
                    >
                      <Text className='font-semibold' style={{ color: colors.text }}>
                        Tạm tính
                      </Text>
                      <Text className='font-bold' style={{ color: colors.primary }}>
                        {formatCurrency(total)}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </CollapsibleSection>
        )}
      />

      {/* 🔵 Background fetching (chỉ khi có data) */}
      {isFetching && !isRefetching && data.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 10,
            right: 10
          }}
        >
          <ActivityIndicator size='small' color={colors.primary} />
        </View>
      )}
    </View>
  )
}
