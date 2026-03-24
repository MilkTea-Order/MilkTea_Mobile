import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView, useKeyboardState } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AnimatedLogoContainer } from '@/components/atoms/AnimatedLogoContainer'
import { AppLogo } from '@/components/molecules/AppLogo'
import { LoginBackground } from '@/components/molecules/LoginBackground'
import { ApiConfigModal } from '@/components/organisms/ApiConfigModal'
import { LoginForm } from '@/components/organisms/LoginForm'
import { useTheme } from '@/shared/hooks/useTheme'
import { useApiConfigStore } from '@/shared/store/apiConfigStore'

export default function LoginScreen() {
  const { colors, isDark, gradients } = useTheme()
  const { isVisible } = useKeyboardState()
  const clearApi = useApiConfigStore((s) => s.clearApiBaseUrl)

  const [showApiModal, setShowApiModal] = useState(false)

  const insets = useSafeAreaInsets()

  const handleForgotPassword = () => {
    clearApi()
  }

  return (
    <View className='flex-1'>
      {/* Background */}
      <LoginBackground colors={colors} isDark={isDark} gradients={gradients} />

      {/* 🔧 API Config Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowApiModal(true)}
        className='absolute z-10 rounded-full p-2'
        style={{
          top: insets.top + 12,
          right: 16,
          backgroundColor: isDark ? `${colors.surface}CC` : `${colors.card}CC`
        }}
      >
        <Ionicons name='settings-outline' size={22} color={colors.textSecondary} />
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
            Milk Tea
          </Text>

          <Text className='text-xl font-semibold' style={{ color: colors.primary }}>
            Shop
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
          <LoginForm onForgotPassword={handleForgotPassword} />
        </View>

        {/* Footer */}
        <View className='mt-8 items-center'>
          <Text className='text-xs' style={{ color: colors.textTertiary }}>
            © {new Date().getFullYear()} Milk Tea Shop
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <ApiConfigModal visible={showApiModal} onClose={() => setShowApiModal(false)} canClose={true} />
    </View>
  )
}
