import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

export interface FilterChipOption<T> {
  value: T
  label: string
  icon?: keyof typeof Ionicons.glyphMap
}

interface FilterChipItemProps<T> {
  item: FilterChipOption<T>
  isActive: boolean
  onPress: () => void
  selectedStyle: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    iconColor?: string
  }
  unselectedStyle: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    iconColor?: string
  }
  itemStyle?: StyleProp<ViewStyle>
}

export function FilterChipItem<T extends string | number>({
  item,
  isActive,
  onPress,
  selectedStyle,
  unselectedStyle,
  itemStyle
}: FilterChipItemProps<T>) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.05, { damping: 12, stiffness: 200 })
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 })
    }
  }, [isActive, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }))

  const style = isActive ? selectedStyle : unselectedStyle

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => {
          opacity.value = withTiming(0.7, { duration: 50 }, () => {
            opacity.value = withTiming(1, { duration: 150 })
          })
          onPress()
        }}
        className='flex-row items-center rounded-full px-5 py-2.5'
        style={[
          {
            borderWidth: isActive ? 0 : 1.5,
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isActive ? 0.15 : 0.08,
            shadowRadius: 4,
            elevation: isActive ? 4 : 2
          },
          itemStyle
        ]}
        activeOpacity={0.9}
      >
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={18}
            color={isActive ? (selectedStyle.iconColor ?? style.iconColor) : style.iconColor}
          />
        )}
        <Text
          className='ml-2 font-bold'
          style={{
            color: isActive ? (selectedStyle.textColor ?? style.textColor) : style.textColor
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
