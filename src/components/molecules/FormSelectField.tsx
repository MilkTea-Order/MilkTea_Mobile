import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'

export interface SelectOption {
  label: string
  value: number | string
}

interface FormSelectFieldProps {
  label?: string
  value: number | string
  options: SelectOption[]
  onChange: (value: number | string) => void
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
  placeholder?: string
  icon?: keyof typeof Ionicons.glyphMap
}

export function FormSelectField({
  label,
  value,
  options,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = 'Chọn...',
  icon = 'list-outline'
}: FormSelectFieldProps) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)
  const listRef = useRef<View | null>(null)
  const hasError = touched && error

  const selectedOption = options.find((opt) => opt.value === value)

  // Đóng dropdown khi mất focus (nhấn ngoài)
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      // No-op placeholder: có thể gắn listener PanResponder nếu cần
    }, 0)
    return () => clearTimeout(timer)
  }, [open])

  return (
    <View className='mb-4'>
      {label && (
        <View className='flex-row items-center mb-2'>
          <Ionicons
            name={icon}
            size={16}
            color={hasError ? colors.error || '#ef4444' : colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text className='text-sm font-semibold' style={{ color: colors.text }}>
            {label}
            {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
          </Text>
        </View>
      )}

      {/* Container relative để dropdown overlay, không đẩy layout */}
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <View
            className='flex-row items-center justify-between px-4 py-3'
            style={{
              backgroundColor: disabled ? colors.surface : colors.card,
              borderWidth: 1,
              borderColor: hasError ? colors.error || '#ef4444' : colors.border,
              opacity: disabled ? 0.6 : 1,
              borderRadius: 10
            }}
          >
            <Text
              style={{
                color: selectedOption ? colors.text : colors.textTertiary,
                fontSize: 14,
                fontWeight: '500'
              }}
            >
              {selectedOption?.label || placeholder}
            </Text>
            <Ionicons
              name='chevron-down'
              size={16}
              color={colors.textSecondary}
              style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
            />
          </View>
        </TouchableOpacity>

        {/* Inline dropdown list (overlay giống select tag, không đẩy layout) */}
        {open && !disabled && (
          <View
            ref={listRef}
            className='overflow-hidden'
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 2,
              borderWidth: 1,
              borderColor: hasError ? colors.error || '#ef4444' : colors.border,
              backgroundColor: colors.card,
              borderRadius: 10,
              maxHeight: 220,
              zIndex: 20
            }}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value
              const isLast = idx === options.length - 1
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  android_ripple={{ color: `${colors.primary}08` }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    {option.label}
                  </Text>
                  {isSelected && <Ionicons name='checkmark' size={18} color={colors.primary} />}
                </Pressable>
              )
            })}
          </View>
        )}
      </View>

      {hasError && (
        <View className='flex-row items-center mt-1.5 ml-1'>
          <Ionicons name='alert-circle' size={14} color={colors.error || '#ef4444'} />
          <Text className='text-xs ml-1.5' style={{ color: colors.error || '#ef4444' }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  )
}
