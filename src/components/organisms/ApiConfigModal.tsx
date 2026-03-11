import { useTheme } from '@/shared/hooks/useTheme'
import { useApiConfigStore } from '@/shared/store/apiConfigStore'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ApiConfigModalProps {
  visible: boolean
  onClose?: () => void
}

export function ApiConfigModal({ visible, onClose }: ApiConfigModalProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const setApiBaseUrl = useApiConfigStore((s) => s.setApiBaseUrl)

  const [apiUrlInput, setApiUrlInput] = useState('')

  const handleSaveApiUrl = async () => {
    const url = apiUrlInput.trim()
    setApiBaseUrl(url)
    onClose?.()
  }

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => {}}>
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <View
          style={{
            paddingTop: insets.top + 24,
            paddingHorizontal: 20,
            paddingBottom: 24
          }}
        >
          <Text className='text-xl font-bold text-center' style={{ color: colors.text }}>
            Cấu hình API
          </Text>
        </View>

        <View className='flex-1 px-6'>
          <View className='items-center mb-8'>
            <View
              className='w-20 h-20 rounded-full items-center justify-center mb-4'
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Ionicons name='server-outline' size={40} color={colors.primary} />
            </View>
            <Text className='text-base text-center' style={{ color: colors.textSecondary }}>
              Vui lòng cấu hình API URL để tiếp tục sử dụng ứng dụng
            </Text>
          </View>

          <Text className='text-sm mb-2' style={{ color: colors.text }}>
            API Base URL:
          </Text>
          <TextInput
            value={apiUrlInput}
            onChangeText={setApiUrlInput}
            placeholder='https://api.example.com'
            placeholderTextColor={colors.textSecondary}
            className='border rounded-lg px-4 py-4 mb-6'
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.card
            }}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='url'
          />

          <TouchableOpacity
            onPress={handleSaveApiUrl}
            activeOpacity={0.7}
            className='rounded-lg py-4 items-center'
            style={{ backgroundColor: colors.primary }}
          >
            <Text className='text-white font-bold text-lg'>Lưu & Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
