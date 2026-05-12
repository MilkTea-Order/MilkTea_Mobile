import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef } from 'react'
import { FlatList, StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

export interface FilterChipOption<T> {
  value: T
  label: string
  icon?: keyof typeof Ionicons.glyphMap
}

export interface FilterChipProps<T> {
  options: FilterChipOption<T>[]
  selected: T
  onChange: (v: T) => void
  selectedStyle?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    iconColor?: string
  }
  unselectedStyle?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    iconColor?: string
  }
  containerStyle?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
}

export function FilterChip<T extends string | number>({
  options,
  selected,
  onChange,
  selectedStyle = {},
  unselectedStyle = {},
  containerStyle,
  itemStyle
}: FilterChipProps<T>) {
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    const index = options.findIndex((o) => o.value === selected)
    if (index !== -1) {
      listRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true
      })
    }
  }, [selected, options])

  const defaultSelectedStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: 'transparent',
    textColor: undefined as string | undefined,
    iconColor: undefined as string | undefined,
    ...selectedStyle
  }

  const defaultUnselectedStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.4)',
    textColor: 'white',
    iconColor: 'white',
    ...unselectedStyle
  }

  return (
    <FlatList
      ref={listRef}
      data={options}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.value)}
      contentContainerStyle={{ gap: 10, paddingRight: 8, ...(containerStyle as object) }}
      renderItem={({ item }) => {
        const isActive = selected === item.value
        const style = isActive ? defaultSelectedStyle : defaultUnselectedStyle

        return (
          <TouchableOpacity
            onPress={() => onChange(item.value)}
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
            activeOpacity={0.7}
          >
            {item.icon && (
              <Ionicons
                name={item.icon}
                size={18}
                color={isActive ? (defaultSelectedStyle.iconColor ?? style.iconColor) : style.iconColor}
              />
            )}
            <Text
              className={`ml-2 font-bold ${item.icon ? '' : ''}`}
              style={{
                color: isActive ? (defaultSelectedStyle.textColor ?? style.textColor) : style.textColor
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      }}
      onScrollToIndexFailed={() => {
        setTimeout(() => {
          const index = options.findIndex((o) => o.value === selected)
          if (index !== -1) {
            listRef.current?.scrollToIndex({
              index,
              viewPosition: 0.5,
              animated: true
            })
          }
        }, 100)
      }}
    />
  )
}
