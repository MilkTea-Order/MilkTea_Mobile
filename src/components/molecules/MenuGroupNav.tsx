import type { MenuGroupType } from '@/features/order/menu/types/menu.type'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
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

export const MenuGroupNav: React.FC<Props> = ({ groups, selectedGroupId, onSelectGroup, colors }) => {
  const itemsPerRow = Math.ceil(groups.length / 2)
  const firstRow = groups.slice(0, itemsPerRow)
  const secondRow = groups.slice(itemsPerRow)

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
      >
        {firstRow.map(renderGroupItem)}
      </ScrollView>
      {secondRow.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          nestedScrollEnabled={true}
        >
          {secondRow.map(renderGroupItem)}
        </ScrollView>
      )}
    </View>
  )
}
