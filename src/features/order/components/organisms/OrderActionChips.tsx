import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

type ActionChip = {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
  variant?: 'primary' | 'danger' | 'info' | 'warning' | 'default'
  onPress: () => void
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
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 8 }}>
      {actions.map((action) => {
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
            className='flex-row items-center rounded-full px-5 py-2.5'
            style={{
              backgroundColor: isPrimary
                ? colors.primary
                : isDanger
                  ? 'rgba(239, 68, 68, 0.2)'
                  : isInfo
                    ? 'rgba(59, 130, 246, 0.2)'
                    : isWarning
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(255,255,255,0.2)',
              borderWidth: isPrimary ? 0 : 1.5,
              borderColor: isDanger
                ? 'rgba(239, 68, 68, 0.5)'
                : isInfo
                  ? 'rgba(59, 130, 246, 0.5)'
                  : isWarning
                    ? 'rgba(245, 158, 11, 0.5)'
                    : 'rgba(255,255,255,0.4)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isPrimary ? 0.2 : 0.08,
              shadowRadius: 4,
              elevation: isPrimary ? 4 : 2
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={action.icon}
              size={18}
              color={
                isPrimary ? 'white' : isDanger ? colors.error : isInfo ? infoColor : isWarning ? warningColor : 'white'
              }
            />
            <Text
              className='ml-2 font-bold'
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
    </ScrollView>
  )
}
