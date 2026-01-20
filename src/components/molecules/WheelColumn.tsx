import { CENTER_PADDING, ITEM_HEIGHT, LIST_HEIGHT } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { getIndexFromOffset } from '@/shared/utils/utils'
import React, { useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, View } from 'react-native'
import { clamp } from 'react-native-reanimated'

interface WheelColumnProps<T> {
  title: string
  items: T[]
  getKey: (item: T) => string | number
  renderLabel: (item: T) => string
  selectedIndex: number
  onIndexChange: (nextIndex: number) => void
}

export function WheelColumn<T>({
  title,
  items,
  getKey,
  renderLabel,
  selectedIndex,
  onIndexChange
}: WheelColumnProps<T>) {
  const { colors } = useTheme()
  const ref = useRef<ScrollView | null>(null)

  useEffect(() => {
    if (!ref.current || !items.length) return
    const safeIndex = clamp(selectedIndex, 0, items.length - 1)

    const id = setTimeout(() => {
      ref.current?.scrollTo({ y: safeIndex * ITEM_HEIGHT, animated: false })
    }, 0)

    return () => clearTimeout(id)
  }, [selectedIndex, items.length])

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = getIndexFromOffset(e.nativeEvent.contentOffset.y, items.length)
    if (idx !== selectedIndex) onIndexChange(idx)
  }

  const onEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS === 'android') {
      const idx = getIndexFromOffset(e.nativeEvent.contentOffset.y, items.length)
      if (idx !== selectedIndex) onIndexChange(idx)
    }
  }

  return (
    <View className='flex-1 px-2'>
      <Text className='text-center text-sm font-semibold mb-3' style={{ color: colors.textSecondary }}>
        {title}
      </Text>

      <View style={{ height: LIST_HEIGHT }}>
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate='fast'
          onMomentumScrollEnd={onMomentumEnd}
          onScrollEndDrag={onEndDrag}
          contentContainerStyle={{ paddingVertical: CENTER_PADDING }}
        >
          {items.map((item, i) => {
            const isActive = i === selectedIndex
            return (
              <View
                key={getKey(item)}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    color: isActive ? colors.primary : colors.text,
                    fontWeight: isActive ? '700' : '400',
                    fontSize: 16
                  }}
                >
                  {renderLabel(item)}
                </Text>
              </View>
            )
          })}
        </ScrollView>

        {/* Center line */}
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            left: 6,
            right: 6,
            top: CENTER_PADDING,
            height: ITEM_HEIGHT,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: `${colors.primary}55`
          }}
        />
      </View>
    </View>
  )
}
