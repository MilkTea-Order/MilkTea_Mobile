import type { MenuGroupType } from '@/features/order/menu/types/menu.type'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

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

export const MenuGroupNavV2: React.FC<Props> = ({ groups, selectedGroupId, onSelectGroup, colors }) => {
  const itemsPerRow = Math.ceil(groups.length / 2)
  const firstRow = groups.slice(0, itemsPerRow)
  const secondRow = groups.slice(itemsPerRow)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const scrollableWidth = contentSize.width - layoutMeasurement.width
    if (scrollableWidth > 0) {
      const progress = contentOffset.x / scrollableWidth
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    } else {
      setScrollProgress(0)
    }
  }

  const renderGroupItem = (group: MenuGroupType) => {
    const isSelected = selectedGroupId === group.MenuGroupID
    // TODO: Replace with actual image URL when available in API
    const imageUrl = (group as any).MenuGroupImage || null

    return (
      <TouchableOpacity
        key={group.MenuGroupID}
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
            width: 70,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className='w-full h-full rounded-full' resizeMode='cover' />
          ) : (
            <Ionicons name='restaurant-outline' size={32} color={isSelected ? 'white' : colors.primary} />
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
          {group.MenuGroupName}
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
        nestedScrollEnabled={true}
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
      <View
        style={{
          height: 2,
          backgroundColor: `${colors.border}40`,
          width: 120,
          alignSelf: 'center',
          marginBottom: 8,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            height: '100%',
            width: 24,
            backgroundColor: colors.primary,
            borderRadius: 1,
            position: 'absolute',
            left: `${50 + (scrollProgress - 0.5) * 40}%`,
            marginLeft: -12
          }}
        />
      </View>
    </View>
  )
}
