import type { MenuGroupType } from '@/features/order/types/meny_catalog.type'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  groups: MenuGroupType[]
  selectedGroupId: number | null
  onSelectGroup: (group: MenuGroupType) => void
  colors: {
    card: string
    border: string
    text: string
    textSecondary: string
    primary: string
    background: string
  }
}

export default function MenuGroupNavV2({ groups, selectedGroupId, onSelectGroup, colors }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0)

  // Split groups into two rows
  const [firstRow, secondRow] = groups.reduce<[MenuGroupType[], MenuGroupType[]]>(
    (acc, group, index) => {
      acc[index % 2].push(group)
      return acc
    },
    [[], []]
  )

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //   nativeEvent: {
    //   contentInset: {bottom, left, right, top},
    //   contentOffset: {x, y}, // Ví trí hiện tại của scroll
    //   contentSize: {height, width}, // Kích thước toàn bộ nội dung bên trong scroll
    //   layoutMeasurement: {height, width}, // Kích thước của viewport (khu vực hiển thị)
    //   velocity: {x, y}, // Tốc độ di chuyển của scroll
    //   responderIgnoreScroll: boolean,
    //   zoomScale,
    //   targetContentOffset: {x, y} //IOS only
    // }
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const scrollableWidth = contentSize.width - layoutMeasurement.width

    const next = scrollableWidth > 0 ? Math.max(0, Math.min(1, contentOffset.x / scrollableWidth)) : 0

    setScrollProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
  }

  const renderGroupItem = (group: MenuGroupType) => {
    const isSelected = selectedGroupId === group.menuGroupId
    const imageUrl = (group as any).menuGroupImage || null

    return (
      <TouchableOpacity
        key={group.menuGroupId}
        onPress={() => onSelectGroup(group)}
        activeOpacity={0.8}
        className='items-center mr-4'
        style={{ width: 80 }}
      >
        <View
          className='rounded-full p-3 mb-2'
          style={{
            backgroundColor: isSelected ? colors.primary : `${colors.primary}15`,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? colors.primary : colors.border,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className='w-full h-full rounded-full' resizeMode='cover' />
          ) : (
            <Ionicons name='restaurant-outline' size={24} color={isSelected ? 'white' : colors.primary} />
          )}
        </View>
        <Text
          className='text-xs text-center'
          numberOfLines={2}
          style={{
            color: isSelected ? colors.primary : colors.text,
            fontWeight: isSelected ? '600' : '400'
          }}
        >
          {group.menuGroupName}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View>
          <View className='flex-row' style={{ marginBottom: secondRow.length > 0 ? 8 : 0 }}>
            {firstRow.map(renderGroupItem)}
          </View>
          {secondRow.length > 0 && <View className='flex-row'>{secondRow.map(renderGroupItem)}</View>}
        </View>
      </ScrollView>
      {/* Scroll Indicator */}
      <View className='relative justify-center align-middle mb-[8px] rounded-[1px] h-[2px] w-[120px] mx-auto'>
        <View
          className='h-full rounded-[1px] absolute w-[24px]'
          style={{
            backgroundColor: colors.primary,
            position: 'absolute',
            left: `${50 + (scrollProgress - 0.5) * 40}%`
          }}
        />
      </View>
    </View>
  )
}
