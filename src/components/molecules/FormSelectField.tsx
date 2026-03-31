import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export interface SelectOption {
  label: string
  value: number | string
}

interface FormSelectFieldProps {
  label?: string
  value: number | string
  options: SelectOption[]
  onChange: (value: number | string) => void
  onPress?: () => void
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
  onPress,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = 'Chọn...',
  icon = 'list-outline'
}: FormSelectFieldProps) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)

  const hasError = touched && error
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <View className='mb-4'>
      {label && (
        <View className='flex-row items-center mb-2'>
          <Ionicons
            name={icon}
            size={16}
            color={hasError ? colors.error : colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text className='text-sm font-semibold' style={{ color: colors.text }}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        </View>
      )}

      {/* container relative */}
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => {
            if (disabled) return

            onPress?.()
            setOpen((v) => !v)
          }}
          activeOpacity={0.7}
        >
          <View
            className='flex-row items-center justify-between px-4 py-3'
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: hasError ? colors.error : colors.border,
              borderRadius: 10
            }}
          >
            <Text
              style={{
                color: selectedOption ? colors.text : colors.textTertiary,
                fontSize: 15,
                fontWeight: '500'
              }}
            >
              {selectedOption?.label || placeholder}
            </Text>

            <Ionicons name='chevron-down' size={16} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* DROPDOWN */}
        {open && (
          <>
            {/* overlay để click ngoài */}
            <Pressable
              style={{
                position: 'absolute',
                top: -1000,
                bottom: -1000,
                left: -1000,
                right: -1000,
                zIndex: 1
              }}
              onPress={() => setOpen(false)}
            />

            {/* dropdown */}
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                backgroundColor: colors.card,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                maxHeight: 200,
                zIndex: 2
              }}
            >
              <ScrollView keyboardShouldPersistTaps='handled'>
                {options.map((item) => {
                  const isSelected = item.value === value

                  return (
                    <Pressable
                      key={String(item.value)}
                      onPress={() => {
                        onChange(item.value)
                        setOpen(false)
                      }}
                      style={{
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? `${colors.primary}15` : 'transparent'
                      }}
                    >
                      <Text style={{ color: colors.text }}>{item.label}</Text>

                      {isSelected && <Ionicons name='checkmark' size={18} color={colors.primary} />}
                    </Pressable>
                  )
                })}
              </ScrollView>
            </View>
          </>
        )}
      </View>

      {hasError && <Text style={{ color: colors.error, fontSize: 12 }}>{error}</Text>}
    </View>
  )
}
