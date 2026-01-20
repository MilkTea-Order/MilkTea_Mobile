import { DatePickerModal } from '@/components/molecules/DatePickerModal'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDisplayDate, formatISODate, parseStringToDate } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface FormDatePickerProps {
  label?: string
  value: string
  onChange: (date: string) => void
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
}

export function FormDatePicker({
  label,
  value,
  onChange,
  error,
  touched,
  required = false,
  disabled = false
}: FormDatePickerProps) {
  const { colors } = useTheme()
  const [showPicker, setShowPicker] = useState(false)
  const hasError = touched && error

  const committedDate = useMemo(() => {
    return parseStringToDate(value) ?? (value ? dayjs(value) : null)
  }, [value])

  const open = () => !disabled && setShowPicker(true)
  const close = () => setShowPicker(false)

  return (
    <View className='mb-4'>
      {label && (
        <View className='flex-row items-center mb-2'>
          <Ionicons
            name='calendar-outline'
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

      <TouchableOpacity onPress={open} disabled={disabled} activeOpacity={disabled ? 1 : 0.7}>
        <View
          className='flex-row items-center justify-between rounded-xl px-4 py-3.5'
          style={{
            backgroundColor: disabled ? colors.surface : colors.card,
            borderWidth: 2,
            borderColor: hasError ? colors.error || '#ef4444' : colors.border,
            opacity: disabled ? 0.6 : 1
          }}
        >
          <Text
            style={{
              color: committedDate ? colors.text : colors.textTertiary,
              fontSize: 15,
              fontWeight: '500'
            }}
          >
            {committedDate ? formatDisplayDate(committedDate) : 'Chọn ngày'}
          </Text>
          <Ionicons name='calendar' size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {hasError && (
        <View className='flex-row items-center mt-1.5 ml-1'>
          <Ionicons name='alert-circle' size={14} color={colors.error || '#ef4444'} />
          <Text className='text-xs ml-1.5' style={{ color: colors.error || '#ef4444' }}>
            {error}
          </Text>
        </View>
      )}

      <DatePickerModal
        visible={showPicker}
        initialDate={committedDate ?? dayjs()}
        onCancel={close}
        onConfirm={(d) => {
          onChange(formatISODate(d))
          close()
        }}
      />
    </View>
  )
}
