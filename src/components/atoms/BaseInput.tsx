import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'

export interface BaseInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  icon?: keyof typeof Ionicons.glyphMap
  containerStyle?: any
  rightIcon?: keyof typeof Ionicons.glyphMap
  onRightIconPress?: () => void
  isPassword?: boolean
  showPasswordToggle?: boolean
  label?: string
  required?: boolean
  error?: string
}

export const BaseInput = forwardRef<TextInput, BaseInputProps>(function BaseInput(
  {
    icon,
    containerStyle,
    rightIcon,
    onRightIconPress,
    isPassword = false,
    showPasswordToggle = false,
    label,
    required,
    error,
    ...textInputProps
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const { colors } = useTheme()

  const inputRef = useRef<TextInput>(null)
  useImperativeHandle(ref, () => inputRef.current as TextInput)

  const shouldShowPasswordToggle = isPassword && showPasswordToggle
  const secureTextEntry = isPassword && !showPassword

  const borderColor = error ? '#ef4444' : colors.border

  return (
    <View>
      {label && (
        <Text className='text-sm font-semibold mb-2 ml-1' style={{ color: colors.text }}>
          {label}
          {required && <Text style={{ color: '#ef4444' }}> *</Text>}
        </Text>
      )}
      <View
        className='flex-row items-center rounded-2xl px-5 py-4'
        style={[
          {
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor
          },
          containerStyle
        ]}
      >
        {icon && (
          <View
            className='rounded-xl p-2.5 mr-4'
            style={{
              backgroundColor: `${colors.primary}15`
            }}
          >
            <Ionicons name={icon} size={22} color={colors.primary} />
          </View>
        )}

        <TextInput
          ref={inputRef}
          className='flex-1'
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '500'
          }}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
          autoCapitalize={isPassword ? 'none' : textInputProps.autoCapitalize}
          selectTextOnFocus={false}
          {...textInputProps}
        />

        {shouldShowPasswordToggle && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className='ml-3 p-2' activeOpacity={0.7}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {rightIcon && !shouldShowPasswordToggle && (
          <TouchableOpacity onPress={onRightIconPress} className='ml-3 p-2' activeOpacity={0.7}>
            <Ionicons name={rightIcon} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className='text-xs mt-1 ml-1' style={{ color: '#ef4444' }}>
          {error}
        </Text>
      )}
    </View>
  )
})
