import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { useInventoryReport } from '@/features/report/hooks/useReport'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrency, formatNumber } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function InventoryScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

  const { inventory = [], isLoading, isFetching, isRefetching, refetch } = useInventoryReport()

  const data = useMemo(() => inventory, [inventory])

  // ✅ define width dùng chung
  const COL = {
    name: 130,
    small: 80,
    large: 80,
    price: 110,
    total: 100,
    status: 90
  }

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
          flexGrow: 1
        }}
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
          <CollapsibleSection title={group.name} icon='cube-outline' defaultExpanded>
            <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 8 }}>
              <View>
                {/* 🔥 TABLE HEADER (FIXED ALIGN) */}
                <View
                  className='flex-row items-center rounded-xl pl-3 py-2.5 mb-2'
                  style={{ backgroundColor: colors.primary + '12' }}
                >
                  <View style={{ width: COL.name }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Nguyên liệu
                    </Text>
                  </View>

                  <View style={{ width: COL.small, alignItems: 'flex-end' }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Tồn (nhỏ)
                    </Text>
                  </View>

                  <View style={{ width: COL.large, alignItems: 'flex-end' }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Tồn (lớn)
                    </Text>
                  </View>

                  <View style={{ width: COL.price, alignItems: 'flex-end' }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Giá nhập
                    </Text>
                  </View>

                  <View style={{ width: COL.total, alignItems: 'flex-end', paddingRight: 20 }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Tạm tính
                    </Text>
                  </View>

                  <View style={{ width: COL.status, alignItems: 'center' }}>
                    <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                      Trạng thái
                    </Text>
                  </View>
                </View>

                {/* 🔥 DATA */}
                {group.materialItems.map((item, index) => {
                  const total = item.unitMin.quantity * item.latestPriceImport

                  return (
                    <View
                      key={item.id}
                      className='flex-row items-center rounded-xl px-3 py-3 mb-1.5'
                      style={{
                        backgroundColor: index % 2 === 0 ? colors.background : colors.card,
                        borderWidth: 1,
                        borderColor: colors.border
                      }}
                    >
                      {/* NAME */}
                      <View style={{ width: COL.name }}>
                        <Text className='font-bold text-sm' style={{ color: colors.text }} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className='text-xs mt-0.5' style={{ color: colors.textSecondary }} numberOfLines={1}>
                          {formatNumber(item.styleQuantity, 0)} {item.unitMin.name}/{item.unitMax.name}
                        </Text>
                      </View>

                      {/* UNIT MIN */}
                      <View style={{ width: COL.small, alignItems: 'flex-end' }}>
                        <Text className='text-sm font-medium' style={{ color: colors.text }}>
                          {formatNumber(item.unitMin.quantity)}
                        </Text>
                        <Text className='text-xs' style={{ color: colors.textSecondary }}>
                          {item.unitMin.name}
                        </Text>
                      </View>

                      {/* UNIT MAX */}
                      <View style={{ width: COL.large, alignItems: 'flex-end' }}>
                        <Text className='text-sm font-medium' style={{ color: colors.text }}>
                          {formatNumber(item.unitMax.quantity)}
                        </Text>
                        <Text className='text-xs' style={{ color: colors.textSecondary }}>
                          {item.unitMax.name}
                        </Text>
                      </View>

                      {/* PRICE */}
                      <View style={{ width: COL.price, alignItems: 'flex-end' }}>
                        <Text className='text-sm font-medium' style={{ color: colors.text }}>
                          {formatCurrency(item.latestPriceImport)}
                        </Text>
                      </View>

                      {/* TOTAL */}
                      <View style={{ width: COL.total, alignItems: 'flex-end', paddingRight: 20 }}>
                        <Text className='text-sm font-bold' style={{ color: colors.primary }}>
                          {formatCurrency(total)}
                        </Text>
                      </View>

                      {/* STATUS */}
                      <View style={{ width: COL.status, alignItems: 'center' }}>
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
                            numberOfLines={1}
                          >
                            {item.status.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </CollapsibleSection>
        )}
      />

      {/* loading nhỏ góc */}
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
