import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

export interface InventorySearchInputProps {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  onClear?: () => void
  placeholder?: string
}

export function InventorySearchInput({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Tìm kiếm nguyên liệu...'
}: InventorySearchInputProps) {
  const { colors } = useTheme()
  const inputRef = useRef<TextInput | null>(null)
  const canSubmit = value.trim().length > 0

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit?.()
    }
  }

  const handleClear = () => {
    onChangeText('')
    onClear?.()
  }

  return (
    <View
      className='flex-row items-center rounded-2xl px-4 p-3'
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <TouchableOpacity onPress={handleSubmit} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5 }}>
        <Ionicons name='search' size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <View className='flex-1 ml-3 flex-row items-center'>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType='search'
          enablesReturnKeyAutomatically={canSubmit}
          className='text-base flex-1'
          style={{ color: colors.textSecondary, opacity: canSubmit ? 1 : 0.5 }}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} className='ml-2'>
            <Ionicons name='close-circle-sharp' size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
