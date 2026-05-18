import React, { useEffect, useRef } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { FilterChipItem, FilterChipOption } from '../atoms/FilterChipItem'

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
      renderItem={({ item }) => (
        <FilterChipItem
          item={item}
          isActive={selected === item.value}
          onPress={() => onChange(item.value)}
          selectedStyle={defaultSelectedStyle}
          unselectedStyle={defaultUnselectedStyle}
          itemStyle={itemStyle}
        />
      )}
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
