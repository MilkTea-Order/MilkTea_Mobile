import { SectionHeader } from '@/components/atoms/SectionHeader'
import { useTheme } from '@/shared/hooks/useTheme'
import React from 'react'
import { View } from 'react-native'

interface FormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  const { colors } = useTheme()

  return (
    <View className={`mb-6 ${className}`}>
      <SectionHeader title={title} />
      <View
        className='rounded-2xl p-4'
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border
        }}
      >
        {children}
      </View>
    </View>
  )
}
