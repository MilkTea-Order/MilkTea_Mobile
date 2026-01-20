import { useTheme } from '@/shared/hooks/useTheme'
import { UploadFile } from '@/shared/types/file.type'
import { Ionicons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

interface FormFilePickerProps {
  label?: string
  value?: UploadFile | null
  onChange: (file: UploadFile | null) => void
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export function FormFilePicker({
  label,
  value,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = 'Tải lên tệp'
}: FormFilePickerProps) {
  const { colors } = useTheme()
  const hasError = touched && error
  const [isPicking, setIsPicking] = useState(false)

  const pickFile = async () => {
    if (disabled || isPicking) return
    try {
      setIsPicking(true)
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: '*/*'
      })

      if (result.canceled) return
      const asset = result.assets?.[0]
      if (!asset) return

      onChange({
        uri: asset.uri,
        name: asset.name ?? 'upload',
        type: asset.mimeType ?? 'application/octet-stream'
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsPicking(false)
    }
  }

  const clear = () => {
    if (disabled) return
    onChange(null)
  }

  return (
    <View className='mb-4'>
      {label && (
        <View className='flex-row items-center mb-2'>
          <Ionicons
            name='cloud-upload-outline'
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

      <View
        className='rounded-xl px-4 py-3.5'
        style={{
          backgroundColor: disabled ? colors.surface : colors.card,
          borderWidth: 2,
          borderColor: hasError ? colors.error || '#ef4444' : colors.border,
          opacity: disabled ? 0.6 : 1
        }}
      >
        <View className='flex-row items-center justify-between'>
          <View className='flex-1 pr-3'>
            <Text
              numberOfLines={1}
              style={{
                color: value ? colors.text : colors.textTertiary,
                fontSize: 15,
                fontWeight: '500'
              }}
            >
              {value ? value.name : placeholder}
            </Text>
          </View>

          {isPicking ? (
            <ActivityIndicator size='small' color={colors.primary} />
          ) : value ? (
            <TouchableOpacity onPress={clear} disabled={disabled} activeOpacity={0.7}>
              <Ionicons name='trash-outline' size={20} color={colors.error || '#ef4444'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickFile} disabled={disabled} activeOpacity={0.7}>
              <Ionicons name='cloud-upload' size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
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
