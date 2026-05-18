import { useTheme } from '@/shared/hooks/useTheme'
import React from 'react'
import { Text } from 'react-native'

interface SectionHeaderProps {
  title: string
  className?: string
}

export function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  const { colors } = useTheme()

  return (
    <Text className={`mb-4 text-lg font-bold ${className}`} style={{ color: colors.text }}>
      {title}
    </Text>
  )
}
