import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

type ActionButtonVariant = 'primary' | 'danger' | 'default'

type ActionButtonProps = {
  label: string
  icon: keyof typeof Ionicons.glyphMap
  variant?: ActionButtonVariant
  onPress: () => void
  disabled?: boolean
  compact?: boolean
  colors: {
    primary: string
    error: string
    text: string
    textSecondary: string
    border: string
    card: string
  }
}

export function ActionButton({
  label,
  icon,
  variant = 'default',
  onPress,
  disabled,
  compact = false,
  colors
}: ActionButtonProps) {
  const styleByVariant = React.useMemo(() => {
    if (variant === 'primary') {
      return {
        bg: colors.primary,
        border: 'transparent',
        text: 'white'
      }
    }
    if (variant === 'danger') {
      return {
        bg: `${colors.error}15`,
        border: `${colors.error}55`,
        text: colors.error
      }
    }
    return {
      bg: colors.card,
      border: colors.border,
      text: colors.text
    }
  }, [variant, colors])

  const paddingVertical = compact ? 9 : 12
  const paddingHorizontal = compact ? 8 : 10
  const iconSize = compact ? 16 : 18
  const textClassName = compact ? 'text-xs font-bold' : 'text-sm font-bold'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className='flex-1 rounded-2xl border'
      style={{
        backgroundColor: disabled ? `${styleByVariant.bg}80` : styleByVariant.bg,
        borderColor: styleByVariant.border,
        paddingVertical,
        paddingHorizontal,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 6 : 8,
        opacity: disabled ? 0.7 : 1
      }}
    >
      <Ionicons name={icon} size={iconSize} color={styleByVariant.text} />
      <Text className={textClassName} style={{ color: styleByVariant.text }} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}
