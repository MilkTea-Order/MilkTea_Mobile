import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

export interface SearchInputBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  onClear?: () => void
  placeholder?: string
}

export function SearchInputBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Tìm kiếm...'
}: SearchInputBarProps) {
  const { colors } = useTheme()
  const inputRef = useRef<TextInput | null>(null)

  const handleClear = () => {
    onChangeText('')
    onClear?.()
  }

  return (
    <View
      className='flex-row items-center px-4 rounded-2xl mx-3 mb-3'
      style={{
        height: 48,
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: colors.border,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <TouchableOpacity onPress={() => inputRef.current?.focus()}>
        <Ionicons name='search' size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary + '99'}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType='search'
        className='flex-1 ml-3 text-base'
        style={{
          color: colors.text,
          paddingVertical: 0,
          textAlignVertical: 'center'
        }}
      />

      {value.length > 0 ? (
        <View className='flex-row items-center gap-2'>
          <TouchableOpacity onPress={handleClear} style={{ justifyContent: 'center' }}>
            <Ionicons name='close-circle-sharp' size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}
