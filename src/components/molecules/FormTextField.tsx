import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface FormTextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
}

export function FormTextField({
  label,
  icon,
  error,
  touched,
  required = false,
  disabled = false,
  ...textInputProps
}: FormTextFieldProps) {
  const { colors } = useTheme()
  const hasError = touched && error

  return (
    <View className='mb-4'>
      {label && (
        <View className='flex-row items-center mb-2'>
          {icon && (
            <Ionicons
              name={icon}
              size={16}
              color={hasError ? colors.error || '#ef4444' : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
          )}
          <Text className='text-sm font-semibold' style={{ color: colors.text }}>
            {label}
            {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
          </Text>
        </View>
      )}

      <View
        className='rounded-xl px-4 py-3.5'
        style={{
          backgroundColor: disabled ? colors.surface : colors.card,
          borderWidth: 2,
          borderColor: hasError ? colors.error || '#ef4444' : colors.border,
          opacity: disabled ? 0.6 : 1,
          shadowColor: hasError ? colors.error || '#ef4444' : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: hasError ? 2 : 0
        }}
      >
        <TextInput
          {...textInputProps}
          editable={!disabled}
          placeholderTextColor={colors.textTertiary}
          style={{
            color: colors.text,
            fontSize: 15,
            fontWeight: '500',
            padding: 0,
            margin: 0
          }}
        />
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
