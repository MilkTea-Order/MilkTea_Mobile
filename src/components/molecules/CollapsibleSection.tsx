import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: keyof typeof Ionicons.glyphMap
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  icon = 'chevron-down'
}: CollapsibleSectionProps) {
  const { colors } = useTheme()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current

  const toggleSection = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' }
    })

    const toValue = isExpanded ? 0 : 1
    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start()
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (defaultExpanded) {
      rotateAnim.setValue(1)
    }
  }, [defaultExpanded, rotateAnim])

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

  return (
    <View
      className='mb-3 rounded-2xl overflow-hidden'
      style={{
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: isExpanded ? colors.primary + '30' : colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isExpanded ? 0.1 : 0.05,
        shadowRadius: 8,
        elevation: isExpanded ? 4 : 2
      }}
    >
      <TouchableOpacity
        onPress={toggleSection}
        className='flex-row items-center justify-between px-5 py-4'
        activeOpacity={0.8}
        style={{
          backgroundColor: isExpanded ? `${colors.primary}08` : 'transparent'
        }}
      >
        <View className='flex-row items-center flex-1'>
          {icon && (
            <View
              className='rounded-xl p-2.5 mr-3'
              style={{
                backgroundColor: `${colors.primary}20`
              }}
            >
              <Ionicons name={icon} size={22} color={colors.primary} />
            </View>
          )}
          <Text className='text-lg font-bold flex-1' style={{ color: colors.text }}>
            {title}
          </Text>
        </View>
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }]
          }}
        >
          <Ionicons name='chevron-down' size={24} color={colors.primary} />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View className='px-5 py-4' style={{ backgroundColor: colors.card }}>
          {children}
        </View>
      )}
    </View>
  )
}
