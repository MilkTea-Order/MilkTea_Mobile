import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'

import { useTheme } from '@/shared/hooks/useTheme'
import { useApiConfigStore } from '@/shared/store/apiConfigStore'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

  // API Config state
  const [apiUrlInput, setApiUrlInput] = useState('')
  const setApiBaseUrl = useApiConfigStore((s) => s.setApiBaseUrl)
  const apiBaseUrl = useApiConfigStore((s) => s.apiBaseUrl)

  // Settings states
  // const [pushNotifications, setPushNotifications] = useState(true)
  // const [emailNotifications, setEmailNotifications] = useState(false)
  // const [orderNotifications, setOrderNotifications] = useState(true)
  // const [promotionNotifications, setPromotionNotifications] = useState(true)
  // const [darkMode, setDarkMode] = useState(false)
  // const [biometricAuth, setBiometricAuth] = useState(false)

  const handleSaveApiUrl = () => {
    setApiBaseUrl(apiUrlInput.trim())
  }

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className='absolute bg-white/20 rounded-full p-2'
          style={{
            top: insets.top + 16,
            left: 20,
            zIndex: 10
          }}
          activeOpacity={0.7}
        >
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text className='text-white text-2xl font-bold text-center mt-2'>Cấu hình</Text>
      </LinearGradient>

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
        {/* Notification Settings */}
        {/* <CollapsibleSection title='Thông báo' icon='notifications-outline' defaultExpanded={true}>
          <SettingItem
            icon='phone-portrait-outline'
            label='Thông báo đẩy'
            description='Nhận thông báo trên thiết bị'
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <SettingItem
            icon='mail-outline'
            label='Thông báo qua email'
            description='Nhận cập nhật qua email'
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <SettingItem
            icon='receipt-outline'
            label='Thông báo đơn hàng'
            description='Cập nhật trạng thái đơn hàng'
            value={orderNotifications}
            onValueChange={setOrderNotifications}
          />
          <SettingItem
            icon='pricetag-outline'
            label='Khuyến mãi & ưu đãi'
            description='Nhận thông tin khuyến mãi mới'
            value={promotionNotifications}
            onValueChange={setPromotionNotifications}
          />
        </CollapsibleSection> */}

        {/* Security Settings */}
        {/* <CollapsibleSection title='Bảo mật' icon='shield-checkmark-outline' defaultExpanded={true}>
          <SettingItem
            icon='finger-print-outline'
            label='Xác thực sinh trắc học'
            description='Sử dụng vân tay/khuôn mặt để đăng nhập'
            value={biometricAuth}
            onValueChange={setBiometricAuth}
          />
          <TouchableOpacitySettingItem
            icon='key-outline'
            label='Đổi mật khẩu'
            description='Thay đổi mật khẩu đăng nhập'
            onPress={() => router.push('/(protected)/(tabs)/profile/change-password')}
          />
        </CollapsibleSection> */}

        {/* Appearance Settings */}
        {/* <CollapsibleSection title='Giao diện' icon='color-palette-outline' defaultExpanded={true}>
          <SettingItem
            icon='moon-outline'
            label='Chế độ tối'
            description='Giao diện màu tối'
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </CollapsibleSection> */}

        {/* Language Settings */}
        {/* <CollapsibleSection title='Ngôn ngữ' icon='language-outline' defaultExpanded={true}>
          <TouchableOpacitySettingItem
            icon='globe-outline'
            label='Ngôn ngữ'
            description='Tiếng Việt'
            onPress={() => {}}
          />
        </CollapsibleSection> */}

        {/* API Configuration */}
        <CollapsibleSection title='Cấu hình API' icon='server-outline' defaultExpanded={true}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 8
            }}
          >
            <Text className='text-sm mb-2' style={{ color: colors.textSecondary }}>
              API Base URL hiện tại:
            </Text>
            <Text
              className='text-sm font-medium mb-4'
              style={{ color: apiBaseUrl ? colors.primary : colors.textSecondary }}
              numberOfLines={1}
            >
              {apiBaseUrl || 'Chưa cấu hình'}
            </Text>

            <Text className='text-sm mb-2' style={{ color: colors.textSecondary }}>
              Nhập API Base URL mới:
            </Text>
            <TextInput
              value={apiUrlInput}
              onChangeText={setApiUrlInput}
              placeholder='https://api.example.com'
              placeholderTextColor={colors.textSecondary}
              className='border rounded-lg px-4 py-3 mb-4'
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
              className='rounded-lg py-3 items-center'
              style={{ backgroundColor: colors.primary }}
            >
              <Text className='text-white font-semibold'>Lưu API URL</Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>

        {/* About */}
        {/* <CollapsibleSection title='Về ứng dụng' icon='information-circle-outline' defaultExpanded={true}>
          <TouchableOpacitySettingItem
            icon='document-text-outline'
            label='Điều khoản sử dụng'
            description='Xem điều khoản và điều kiện'
            onPress={() => {}}
          />
          <TouchableOpacitySettingItem
            icon='shield-outline'
            label='Chính sách bảo mật'
            description='Xem chính sách bảo mật'
            onPress={() => {}}
          />
          <TouchableOpacitySettingItem
            icon='star-outline'
            label='Đánh giá ứng dụng'
            description='Đánh giá trên App Store'
            onPress={() => {}}
          />
          <TouchableOpacitySettingItem
            icon='code-slash-outline'
            label='Phiên bản'
            description='1.0.0'
            onPress={() => {}}
          />
        </CollapsibleSection> */}
      </ScrollView>
    </View>
  )
}

// Setting Item with Switch
// interface SettingItemProps {
//   icon: string
//   label: string
//   description?: string
//   value: boolean
//   onValueChange: (value: boolean) => void
// }

// function SettingItem({ icon, label, description, value, onValueChange }: SettingItemProps) {
//   const { colors } = useTheme()

//   return (
//     <View
//       className='flex-row items-center justify-between py-3 px-4 rounded-xl'
//       style={{
//         backgroundColor: colors.card,
//         marginBottom: 8
//       }}
//     >
//       <View className='flex-row items-center flex-1 mr-4'>
//         <View
//           className='w-10 h-10 rounded-full items-center justify-center mr-3'
//           style={{ backgroundColor: colors.primary + '20' }}
//         >
//           <Ionicons name={icon as any} size={20} color={colors.primary} />
//         </View>
//         <View className='flex-1'>
//           <Text className='text-base font-semibold' style={{ color: colors.text }}>
//             {label}
//           </Text>
//           {description && (
//             <Text className='text-sm mt-0.5' style={{ color: colors.textSecondary }}>
//               {description}
//             </Text>
//           )}
//         </View>
//       </View>
//       <Switch value={value} onValueChange={onValueChange} />
//     </View>
//   )
// }

// // Setting Item with Touchable (for navigation)
// interface TouchableOpacitySettingItemProps {
//   icon: string
//   label: string
//   description?: string
//   onPress: () => void
// }

// function TouchableOpacitySettingItem({ icon, label, description, onPress }: TouchableOpacitySettingItemProps) {
//   const { colors } = useTheme()

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.7}
//       className='flex-row items-center justify-between py-3 px-4 rounded-xl'
//       style={{
//         backgroundColor: colors.card,
//         marginBottom: 8
//       }}
//     >
//       <View className='flex-row items-center flex-1 mr-4'>
//         <View
//           className='w-10 h-10 rounded-full items-center justify-center mr-3'
//           style={{ backgroundColor: colors.primary + '20' }}
//         >
//           <Ionicons name={icon as any} size={20} color={colors.primary} />
//         </View>
//         <View className='flex-1'>
//           <Text className='text-base font-semibold' style={{ color: colors.text }}>
//             {label}
//           </Text>
//           {description && (
//             <Text className='text-sm mt-0.5' style={{ color: colors.textSecondary }}>
//               {description}
//             </Text>
//           )}
//         </View>
//       </View>
//       <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
//     </TouchableOpacity>
//   )
// }
