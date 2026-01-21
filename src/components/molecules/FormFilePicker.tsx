import { useTheme } from '@/shared/hooks/useTheme'
import { RNFile } from '@/shared/types/file.type'
import { Ionicons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import React, { useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

interface FormFilePickerProps {
  label?: string
  // value có thể là URL từ BE (string) hoặc file user chọn (UploadFile) hoặc null
  value?: RNFile | string | null
  onChange: (file: RNFile | null) => void
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
  const isUrl = typeof value === 'string'
  const previewUri = isUrl ? value : value?.uri

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

  // const clear = () => {
  //   if (disabled) return
  //   onChange(null)
  // }

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
        {/* Preview block */}
        <View className='flex-row items-center'>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
              backgroundColor: colors.surface
            }}
          >
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
            ) : (
              <View className='flex-1 items-center justify-center'>
                <Ionicons name='image-outline' size={28} color={colors.textTertiary} />
              </View>
            )}
          </View>

          <View className='flex-1 pl-3'>
            <Text
              numberOfLines={2}
              style={{
                color: value ? colors.text : colors.textTertiary,
                fontSize: 15,
                fontWeight: '500'
              }}
            >
              {placeholder}
            </Text>

            <View className='flex-row mt-2'>
              {isPicking ? (
                <ActivityIndicator size='small' color={colors.primary} />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={pickFile}
                    disabled={disabled}
                    activeOpacity={0.7}
                    style={{ paddingRight: 12 }}
                  >
                    <View className='flex-row items-center'>
                      <Ionicons name='cloud-upload' size={18} color={colors.primary} />
                      <Text className='ml-1.5' style={{ color: colors.primary, fontWeight: '600' }}>
                        Tải lên
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
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
