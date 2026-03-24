import { useTheme } from '@/shared/hooks/useTheme'
import { useApiConfigStore } from '@/shared/store/apiConfigStore'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ApiConfigModalProps {
  visible: boolean
  onClose?: () => void
  canClose?: boolean
}

export function ApiConfigModal({ visible, onClose, canClose = false }: ApiConfigModalProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const setApiBaseUrl = useApiConfigStore((s) => s.setApiBaseUrl)

  const [apiUrlInput, setApiUrlInput] = useState('')

  const handleSaveApiUrl = () => {
    const url = apiUrlInput.trim()
    if (!url) {
      Alert.alert('Thông báo', 'Vui lòng nhập API Base URL')
      return
    }
    setApiBaseUrl(url)
    onClose?.()
  }

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet' onRequestClose={() => {}}>
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <View className='flex-row items-center px-4 pb-4' style={{ paddingTop: insets.top + 16 }}>
          {canClose ? (
            <TouchableOpacity onPress={onClose} className='p-2 -ml-2'>
              <Ionicons name='close' size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View className='w-8' />
          )}
          <View className='flex-1'>
            <Text className='text-xl font-bold text-center' style={{ color: colors.text }}>
              Cấu hình API
            </Text>
          </View>
          <View className='w-8' />
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
            disabled={!apiUrlInput.trim()}
            className='rounded-lg py-4 items-center'
            style={{
              backgroundColor: apiUrlInput.trim() ? colors.primary : `${colors.primary}50`
            }}
          >
            <Text className='text-white font-bold text-lg'>Lưu & Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
