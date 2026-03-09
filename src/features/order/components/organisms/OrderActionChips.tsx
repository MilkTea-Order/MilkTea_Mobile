import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type ActionChip = {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
  variant?: 'primary' | 'danger' | 'info' | 'warning' | 'default'
  onPress: () => void
  visible?: boolean
}

interface OrderActionChipsProps {
  actions: ActionChip[]
  colors: {
    primary: string
    error: string
    text: string
    background: string
  }
}

export function OrderActionChips({ actions, colors }: OrderActionChipsProps) {
  const visibleActions = actions.filter((action) => action.visible !== false)

  return (
    <View className='flex-row flex-wrap justify-between gap-[10px]'>
      {visibleActions.map((action) => {
        const isPrimary = action.variant === 'primary'
        const isDanger = action.variant === 'danger'
        const isInfo = action.variant === 'info'
        const isWarning = action.variant === 'warning'
        const infoColor = '#3b82f6'
        const warningColor = '#f59e0b'

        return (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            className='flex-row items-center justify-center rounded-xl px-4 py-3'
            style={{
              width: '48%',
              backgroundColor: isPrimary
                ? colors.primary
                : isDanger
                  ? 'rgba(239, 68, 68, 0.15)'
                  : isInfo
                    ? 'rgba(59, 130, 246, 0.15)'
                    : isWarning
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(255,255,255,0.15)',
              borderWidth: isPrimary ? 0 : 1.5,
              borderColor: isDanger
                ? 'rgba(239, 68, 68, 0.4)'
                : isInfo
                  ? 'rgba(59, 130, 246, 0.4)'
                  : isWarning
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(255,255,255,0.3)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isPrimary ? 0.25 : 0.1,
              shadowRadius: 4,
              elevation: isPrimary ? 5 : 3
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={action.icon}
              size={20}
              color={
                isPrimary ? 'white' : isDanger ? colors.error : isInfo ? infoColor : isWarning ? warningColor : 'white'
              }
            />
            <Text
              className='ml-2 font-bold text-sm'
              style={{
                color: isPrimary
                  ? 'white'
                  : isDanger
                    ? colors.error
                    : isInfo
                      ? infoColor
                      : isWarning
                        ? warningColor
                        : 'white'
              }}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
