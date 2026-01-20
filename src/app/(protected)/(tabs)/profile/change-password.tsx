import { ChangePasswordForm } from '@/components/organisms/ChangePasswordForm'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChangePasswordScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

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
        <Text className='text-white text-2xl font-bold text-center mt-2'>Đổi mật khẩu</Text>
      </LinearGradient>

      {/* Form */}
      <ChangePasswordForm />
    </View>
  )
}
