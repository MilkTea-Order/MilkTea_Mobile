import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView, useKeyboardState } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AnimatedLogoContainer } from '@/components/atoms/AnimatedLogoContainer'
import { AppLogo } from '@/components/molecules/AppLogo'
import { LoginBackground } from '@/components/molecules/LoginBackground'
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm'

export default function ResetPasswordScreen() {
  const { colors, isDark, gradients } = useTheme()
  const { isVisible } = useKeyboardState()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { resetPasswordToken, expiresAt } = useLocalSearchParams<{
    resetPasswordToken: string
    expiresAt: string
  }>()

  if (!resetPasswordToken) {
    return (
      <View className='flex-1 items-center justify-center'>
        <View className='items-center'>
          <Ionicons name='warning' size={48} color={colors.error} />
          <Text className='text-lg font-bold mt-4' style={{ color: colors.error }}>
            Liên kết không hợp lệ
          </Text>
          <Text className='text-sm mt-2 text-center px-8' style={{ color: colors.textSecondary }}>
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/forgot-password')}
            className='mt-6 px-6 py-3 rounded-2xl'
            style={{ backgroundColor: colors.primary }}
          >
            <Text className='text-white font-semibold'>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const handleSuccess = () => {
    router.replace('/login')
  }

  return (
    <View className='flex-1'>
      {/* Background */}
      <LoginBackground colors={colors} isDark={isDark} gradients={gradients} />

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.replace('/forgot-password')}
        activeOpacity={0.7}
        className='absolute z-10 rounded-full p-2'
        style={{
          top: insets.top + 12,
          left: 16,
          backgroundColor: isDark ? `${colors.surface}CC` : `${colors.card}CC`
        }}
      >
        <Ionicons name='arrow-back' size={22} color={colors.text} />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24
        }}
        bottomOffset={30}
        disableScrollOnKeyboardHide
        scrollEnabled={isVisible}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        {/* Logo + Title */}
        <View className='items-center pb-6' style={{ paddingTop: 8 }}>
          <AnimatedLogoContainer colors={colors} isDark={isDark}>
            <AppLogo size='large' showText={false} />
          </AnimatedLogoContainer>

          <Text className='text-3xl font-bold tracking-wide mt-4' style={{ color: colors.text }}>
            Đặt lại mật khẩu
          </Text>
        </View>

        {/* Form Card */}
        <View
          className='rounded-3xl p-6'
          style={{
            backgroundColor: isDark ? `${colors.surface}B3` : `${colors.surface}E6`,
            borderWidth: 1,
            borderColor: isDark ? `${colors.border}66` : `${colors.border}B3`,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.4 : 0.15,
            shadowRadius: 30,
            elevation: isDark ? 15 : 8
          }}
        >
          <ResetPasswordForm resetPasswordToken={resetPasswordToken} expiresAt={expiresAt} onSuccess={handleSuccess} />
        </View>

        {/* Footer */}
        <View className='mt-8 items-center'>
          <Text className='text-xs' style={{ color: colors.textTertiary }}>
            © {new Date().getFullYear()} Milk Tea Shop
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
