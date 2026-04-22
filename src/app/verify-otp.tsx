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
import { VerifyOtpForm } from '@/components/organisms/VerifyOtpForm'

export default function VerifyOtpScreen() {
  const { colors, isDark, gradients } = useTheme()
  const { isVisible } = useKeyboardState()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { email, sessionId } = useLocalSearchParams<{ email: string; expiresAt: string; sessionId: string }>()

  if (!sessionId || !email) {
    return (
      <View className='flex-1'>
        {/* Background */}
        <LoginBackground colors={colors} isDark={isDark} gradients={gradients} />

        <View className='flex-1 items-center justify-center px-8'>
          <View
            className='w-full max-w-xs rounded-3xl p-8 items-center'
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
            <View
              className='w-16 h-16 rounded-full items-center justify-center mb-4'
              style={{ backgroundColor: `${colors.error}20` }}
            >
              <Ionicons name='warning' size={32} color={colors.error} />
            </View>

            <Text className='text-lg font-semibold text-center mb-2' style={{ color: colors.error }}>
              Đã xảy ra lỗi
            </Text>

            <Text className='text-sm text-center mb-6' style={{ color: colors.textSecondary }}>
              Liên kết không hợp lệ hoặc đã hết hạn.{'\n'}Vui lòng thử lại.
            </Text>

            <TouchableOpacity
              onPress={() => router.replace('/login')}
              className='w-full py-3.5 rounded-2xl items-center'
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}
            >
              <Text className='text-base font-semibold' style={{ color: '#FFFFFF' }}>
                Quay về đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const handleBack = () => {
    router.back()
  }

  const handleSuccess = (resetPasswordToken: string, expiresAt: string) => {
    router.replace({
      pathname: '/reset-password',
      params: { resetPasswordToken, expiresAt }
    })
  }

  return (
    <View className='flex-1'>
      {/* Background */}
      <LoginBackground colors={colors} isDark={isDark} gradients={gradients} />

      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBack}
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
            Nhập OTP
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
          <VerifyOtpForm email={email} sessionId={Number(sessionId)} onBack={handleBack} onSuccess={handleSuccess} />
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
