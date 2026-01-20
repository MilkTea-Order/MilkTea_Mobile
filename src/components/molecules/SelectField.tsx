import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { BaseInput, BaseInputProps } from '../atoms/BaseInput'

export interface SelectOption {
  label: string
  value: number | string
}

interface SelectFieldProps extends Omit<BaseInputProps, 'value' | 'onChangeText' | 'onChange'> {
  label?: string
  value: number | string
  options: SelectOption[]
  onChange: (value: number | string) => void
  error?: string
  touched?: boolean
  disabled?: boolean
  placeholder?: string
  required?: boolean
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  touched,
  disabled = false,
  icon = 'list-outline',
  placeholder = 'Chọn...',
  required = false,
  ...baseInputProps
}: SelectFieldProps) {
  const { colors } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const hasError = touched && error

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <View className='mb-5'>
      {label && (
        <Text className='text-sm font-semibold mb-2 ml-1' style={{ color: colors.text }}>
          {label}
          {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View
          style={{
            borderRadius: 16,
            borderWidth: 2,
            borderColor: hasError ? colors.error || '#ef4444' : 'transparent',
            opacity: disabled ? 0.5 : 1
          }}
        >
          <BaseInput
            {...baseInputProps}
            icon={icon}
            value={selectedOption?.label || ''}
            editable={false}
            placeholder={placeholder}
            containerStyle={[
              baseInputProps.containerStyle,
              { borderColor: hasError ? colors.error || '#ef4444' : colors.border }
            ]}
            rightIcon='chevron-down'
          />
        </View>
      </TouchableOpacity>

      {hasError && (
        <Text className='text-sm mt-1 ml-2' style={{ color: colors.error || '#ef4444' }}>
          {error}
        </Text>
      )}

      <Modal visible={showModal} transparent animationType='fade' onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity
          className='flex-1 justify-end bg-black/50'
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View
            className='bg-white rounded-t-3xl p-4'
            style={{ backgroundColor: colors.card }}
            onStartShouldSetResponder={() => true}
          >
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-lg font-bold' style={{ color: colors.text }}>
                {label || 'Chọn'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name='close' size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View className='max-h-96'>
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <TouchableOpacity
                    key={String(option.value)}
                    onPress={() => {
                      onChange(option.value)
                      setShowModal(false)
                    }}
                    className='flex-row items-center py-4 px-2'
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border
                    }}
                    activeOpacity={0.7}
                  >
                    <View className='flex-1'>
                      <Text className='text-base' style={{ color: colors.text }}>
                        {option.label}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name='checkmark' size={24} color={colors.primary} />}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
