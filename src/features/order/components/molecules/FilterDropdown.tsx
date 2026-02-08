import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'

export interface FilterOption<T extends string> {
  label: string
  value: T
  icon?: keyof typeof Ionicons.glyphMap
}

interface FilterDropdownProps<T extends string> {
  value: T
  options: FilterOption<T>[]
  onChange: (value: T) => void
  colors: {
    card: string
    border: string
    primary: string
    text: string
    textSecondary: string
    background: string
  }
  placeholder?: string
  icon?: keyof typeof Ionicons.glyphMap
}

export function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  colors,
  placeholder = 'Chọn...',
  icon = 'funnel-outline'
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleSelect = (optionValue: T) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <View style={{ position: 'relative', alignSelf: 'flex-start', zIndex: 1000 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className='flex-row items-center'
        activeOpacity={0.7}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: `${colors.primary}08`,
          borderWidth: 1,
          borderColor: `${colors.primary}20`
        }}
      >
        <Ionicons name={icon} size={14} color={colors.primary} />
        <Text className='text-sm ml-1.5 font-medium' style={{ color: colors.text }}>
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name='chevron-down'
          size={12}
          color={colors.textSecondary}
          style={{ marginLeft: 6, transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {/* Dropdown menu ngay dưới button */}
      {isOpen && (
        <View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            backgroundColor: colors.card,
            borderRadius: 12,
            minWidth: 160,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 10,
            zIndex: 10000,
            overflow: 'hidden'
          }}
        >
          {options.map((option, idx) => {
            const isSelected = value === option.value
            const isLast = idx === options.length - 1
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => handleSelect(option.value)}
                android_ripple={{ color: `${colors.primary}15` }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View className='flex-row items-center flex-1'>
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={16}
                      color={isSelected ? colors.primary : colors.textSecondary}
                      style={{ marginRight: 10 }}
                    />
                  )}
                  <Text
                    style={{
                      color: isSelected ? colors.primary : colors.text,
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    {option.label}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 8
                    }}
                  >
                    <Ionicons name='checkmark' size={11} color='white' />
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}
