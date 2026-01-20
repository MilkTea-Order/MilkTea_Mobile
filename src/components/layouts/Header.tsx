import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { ReactNode } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface HeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  rightContent?: ReactNode
  children?: ReactNode
  showBackButton?: boolean
}

export function Header({ title, subtitle, onBack, rightContent, children, showBackButton = true }: HeaderProps) {
  const router = useRouter()
  const { gradients } = useTheme()
  const insets = useSafeAreaInsets()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <LinearGradient
      colors={gradients.header as any}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 16,
        paddingHorizontal: 20
      }}
    >
      <View className='flex-row items-center justify-between mb-3'>
        <View className='flex-row items-center flex-1'>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              className='bg-white/20 rounded-full p-2.5 mr-3'
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back' size={22} color='white' />
            </TouchableOpacity>
          )}
          <View className='flex-1'>
            <Text className='text-white text-2xl font-bold' numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className='text-white/85 text-sm mt-1' numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightContent && <View className='ml-3'>{rightContent}</View>}
      </View>
      {children && <View className='mt-2'>{children}</View>}
    </LinearGradient>
  )
}
