import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { useInventoryReport } from '@/features/report/hooks/useReport'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrency, formatNumber } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function InventoryScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

  const [searchText, setSearchText] = useState('')
  const [submittedMaterialName, setSubmittedMaterialName] = useState<string | undefined>(undefined)

  const canSubmitSearch = searchText.trim().length > 0

  const { inventory = [], isLoading, isFetching, isRefetching, refetch } = useInventoryReport(submittedMaterialName)

  const data = useMemo(() => inventory, [inventory])
  const searchInputRef = useRef<TextInput>(null)

  const handleSubmitSearch = useCallback(() => {
    if (!canSubmitSearch) return
    setSubmittedMaterialName(searchText.trim())
  }, [searchText, canSubmitSearch])

  const COL = {
    name: 120,
    small: 80,
    unit: 70,
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

      {/* SEARCH INPUT */}
      <View className='px-4 pt-4 pb-2'>
        <View
          className='flex-row items-center rounded-2xl px-4 p-3'
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (canSubmitSearch) {
                handleSubmitSearch()
                return
              }
              searchInputRef.current?.focus()
            }}
            disabled={!canSubmitSearch}
            style={{ opacity: canSubmitSearch ? 1 : 0.5 }}
          >
            <Ionicons name='search' size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View className='flex-1 ml-3 flex-row items-center'>
            <TextInput
              ref={searchInputRef}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text)
                if (text.trim().length === 0) {
                  setSubmittedMaterialName(undefined)
                }
              }}
              onSubmitEditing={handleSubmitSearch}
              returnKeyType='search'
              enablesReturnKeyAutomatically={canSubmitSearch}
              className='text-base flex-1'
              style={{ color: colors.textSecondary, opacity: canSubmitSearch ? 1 : 0.5 }}
              placeholder='Tìm kiếm nguyên liệu...'
              placeholderTextColor={colors.textSecondary}
            />

            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('')
                  setSubmittedMaterialName(undefined)
                }}
                className='ml-2'
              >
                <Ionicons name='close-circle-sharp' size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

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
            <View className='flex-row pb-3'>
              <View style={{ width: COL.name + 16 }}>
                {/* HEADER */}
                <View
                  className='rounded-l-xl pl-3 py-2.5 mb-2 justify-center'
                  style={{
                    backgroundColor: colors.primary + '12',
                    borderColor: colors.primary + '30',
                    borderWidth: 1,
                    borderRightWidth: 0,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12
                  }}
                >
                  <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                    Nguyên liệu
                  </Text>
                </View>

                {group.materialItems.map((item, index) => (
                  <View
                    key={`fixed-${item.id}`}
                    className='pl-2 justify-center'
                    style={{
                      height: 44,
                      backgroundColor: index % 2 === 0 ? colors.background : colors.card,
                      borderWidth: 1,
                      borderRightWidth: 0,
                      borderColor: colors.border
                    }}
                  >
                    <Text className='font-bold text-sm' style={{ color: colors.text }} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* HEADER */}
                  <View
                    className='flex-row items-center py-2.5 mb-2'
                    style={{
                      backgroundColor: colors.primary + '12',
                      borderWidth: 1,
                      borderLeftWidth: 0,
                      borderColor: colors.primary + '30',
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12
                    }}
                  >
                    <View style={{ width: COL.small, alignItems: 'center' }}>
                      <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                        S.Lg tồn
                      </Text>
                    </View>

                    <View style={{ width: COL.unit, alignItems: 'center' }}>
                      <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                        ĐVT
                      </Text>
                    </View>

                    <View style={{ width: COL.price, alignItems: 'center' }}>
                      <Text className='font-semibold text-xs' style={{ color: colors.primary }}>
                        Giá nhập
                      </Text>
                    </View>

                    <View style={{ width: COL.total, alignItems: 'center', paddingRight: 20 }}>
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

                  {/* ROWS */}
                  {group.materialItems.map((item, index) => {
                    const total = item.unitMin.quantity * item.latestPriceImport

                    return (
                      <View
                        key={item.id}
                        className='flex-row items-center px-2'
                        style={{
                          height: 44,
                          backgroundColor: index % 2 === 0 ? colors.background : colors.card,
                          borderWidth: 1,
                          borderLeftWidth: 0,
                          borderColor: colors.border
                        }}
                      >
                        <View style={{ width: COL.small, alignItems: 'center' }}>
                          <Text className='text-sm font-medium' style={{ color: colors.text }}>
                            {formatNumber(item.unitMin.quantity)}
                          </Text>
                        </View>

                        <View style={{ width: COL.unit, alignItems: 'center' }}>
                          <Text className='text-xs' style={{ color: colors.textSecondary }}>
                            {item.unitMin.name}
                          </Text>
                        </View>

                        <View style={{ width: COL.price, alignItems: 'center' }}>
                          <Text className='text-sm font-medium' style={{ color: colors.text }}>
                            {formatCurrency(item.latestPriceImport)}
                          </Text>
                        </View>

                        <View style={{ width: COL.total, alignItems: 'center', paddingRight: 20 }}>
                          <Text className='text-sm font-bold' style={{ color: colors.primary }}>
                            {formatCurrency(total)}
                          </Text>
                        </View>

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
            </View>
          </CollapsibleSection>
        )}
      />

      {/* loading nhỏ */}
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
