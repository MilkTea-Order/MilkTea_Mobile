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
        paddingTop: insets.top + 8,
        paddingBottom: 5,
        paddingHorizontal: 16
      }}
    >
      <View className='flex-row items-center justify-between'>
        <View className='flex-1 flex-row items-center'>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              className='mr-2 rounded-full bg-white/20 p-2'
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back' size={20} color='white' />
            </TouchableOpacity>
          )}
          <View className='flex-1'>
            <Text className='text-xl font-bold text-white' numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className='mt-1 text-base font-semibold text-white/85' numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightContent && <View className='ml-2'>{rightContent}</View>}
      </View>
      {children && <View className='mt-2'>{children}</View>}
    </LinearGradient>
  )
}
