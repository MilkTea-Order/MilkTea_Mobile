import { useApiConfigStore } from '@/shared/store/apiConfigStore'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export interface SettingsFormProps {
  onSuccess?: () => void
}

export function SettingsForm({ onSuccess }: SettingsFormProps) {
  const { colors } = useTheme()
  const [apiUrlInput, setApiUrlInput] = useState('')
  const setApiBaseUrl = useApiConfigStore((s) => s.setApiBaseUrl)
  const apiBaseUrl = useApiConfigStore((s) => s.apiBaseUrl)

  const handleSaveApiUrl = () => {
    setApiBaseUrl(apiUrlInput.trim())
    onSuccess?.()
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 100
      }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* API Configuration */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 8
        }}
      >
        <Text className='mb-2 text-sm' style={{ color: colors.textSecondary }}>
          API Base URL hiện tại:
        </Text>
        <Text
          className='mb-4 text-sm font-medium'
          style={{ color: apiBaseUrl ? colors.primary : colors.textSecondary }}
          numberOfLines={1}
        >
          {apiBaseUrl || 'Chưa cấu hình'}
        </Text>

        <Text className='mb-2 text-sm' style={{ color: colors.textSecondary }}>
          Nhập API Base URL mới:
        </Text>
        <TextInput
          value={apiUrlInput}
          onChangeText={setApiUrlInput}
          placeholder='https://api.example.com'
          placeholderTextColor={colors.textSecondary}
          className='mb-4 rounded-lg border px-4 py-3'
          style={{
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.background
          }}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='url'
        />

        <TouchableOpacity
          onPress={handleSaveApiUrl}
          activeOpacity={0.7}
          className='items-center rounded-lg py-3'
          style={{ backgroundColor: colors.primary }}
        >
          <Text className='font-semibold text-white'>Lưu API URL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
