import { useTheme } from '@/shared/hooks/useTheme'
import React from 'react'
import { Text, View } from 'react-native'
import Logo from '~/assets/images/logo.svg'

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  showGlow?: boolean
}

const sizeMap = {
  small: { icon: 28, text: 16, container: 12 },
  medium: { icon: 40, text: 20, container: 16 },
  large: { icon: 64, text: 28, container: 20 }
}

export function AppLogo({ size = 'medium', showText = true, showGlow = false }: AppLogoProps) {
  const { colors, isDark } = useTheme()
  const sizes = sizeMap[size]
  const logoSize = sizes.icon + sizes.container * 2

  return (
    <View className='items-center'>
      {/* Glow Effect Container */}
      {showGlow && (
        <View
          className='absolute inset-0 rounded-full'
          style={{
            width: logoSize + 20,
            height: logoSize + 20,
            backgroundColor: `${colors.primary}20`,
            transform: [{ scale: 1.3 }]
          }}
        />
      )}

      {/* Logo Container */}
      <View
        className='rounded-full items-center justify-center'
        style={{
          width: logoSize,
          height: logoSize,
          backgroundColor: `${colors.primary}15`,
          borderWidth: 2,
          borderColor: `${colors.primary}30`,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.2,
          shadowRadius: isDark ? 12 : 8,
          elevation: isDark ? 8 : 4
        }}
      >
        <Logo width={sizes.icon + 20} height={sizes.icon + 20} />
      </View>

      {showText && (
        <View className='mt-3 items-center'>
          <Text
            className='font-bold'
            style={{
              fontSize: sizes.text + 2,
              color: colors.text,
              letterSpacing: 0.5
            }}
          >
            Milk Tea Shop
          </Text>
          <Text
            className='mt-1'
            style={{
              fontSize: sizes.text - 6,
              color: colors.textSecondary
            }}
          >
            Quản lý & Order
          </Text>
        </View>
      )}
    </View>
  )
}
