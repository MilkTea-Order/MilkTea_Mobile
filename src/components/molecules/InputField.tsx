import { useTheme } from '@/shared/hooks/useTheme'
import React from 'react'
import { Text, View } from 'react-native'
import { BaseInput, BaseInputProps } from '../atoms/BaseInput'

export interface InputFieldProps extends BaseInputProps {
  label?: string
  error?: string
  touched?: boolean
}

export function InputField({ label, error, touched, ...baseInputProps }: InputFieldProps) {
  const { colors } = useTheme()
  const hasError = touched && error

  return (
    <View className='mb-5'>
      {label && (
        <Text className='text-sm font-semibold mb-2 ml-1' style={{ color: colors.text }}>
          {label}
        </Text>
      )}
      <View
        style={{
          borderRadius: 16,
          borderWidth: 2,
          borderColor: hasError ? colors.error || '#ef4444' : 'transparent'
        }}
      >
        <BaseInput
          {...baseInputProps}
          containerStyle={[
            baseInputProps.containerStyle,
            {
              borderColor: hasError ? colors.error || '#ef4444' : colors.border
            }
          ]}
        />
      </View>
      {hasError && (
        <Text className='text-sm mt-1 ml-2' style={{ color: colors.error || '#ef4444' }}>
          {error}
        </Text>
      )}
    </View>
  )
}
