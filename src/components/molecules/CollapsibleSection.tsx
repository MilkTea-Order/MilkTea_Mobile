import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  CurvedTransition,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

interface CollapsibleSectionProps {
  title?: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  headerContent?: React.ReactNode
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  icon = 'chevron-down',
  headerContent
}: CollapsibleSectionProps) {
  const { colors } = useTheme()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const rotateAnim = useSharedValue(defaultExpanded ? 1 : 0)

  const toggleSection = () => {
    const newValue = !isExpanded
    rotateAnim.value = withSpring(newValue ? 1 : 0, {
      damping: 15,
      stiffness: 100
    })
    setIsExpanded(newValue)
  }

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotateAnim.value, [0, 1], [0, 180])}deg` }]
  }))

  return (
    <Animated.View
      className='mb-2 rounded-2xl overflow-hidden'
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
      layout={
        // LinearTransition.springify().duration(300)
        CurvedTransition.duration(300)
        // .easingX(Easing.inOut(Easing.quad))
        // .easingY(Easing.out(Easing.exp))
        // .easingWidth(Easing.in(Easing.ease))
        // .easingHeight(Easing.out(Easing.ease))
        // .reduceMotion(ReduceMotion.System)
      }
    >
      <TouchableOpacity
        onPress={toggleSection}
        className='flex-row items-center justify-between px-5 py-1'
        activeOpacity={0.8}
        style={{
          backgroundColor: isExpanded ? `${colors.primary}08` : 'transparent'
        }}
      >
        <View className='flex-row items-center flex-1'>
          {headerContent ? (
            headerContent
          ) : (
            <>
              {icon && (
                <View
                  className='rounded-xl p-2.5 mr-3'
                  style={{
                    backgroundColor: `${colors.primary}20`
                  }}
                >
                  <Ionicons name={icon} size={18} color={colors.primary} />
                </View>
              )}
              <Text className='text-lg font-bold flex-1' style={{ color: colors.text }}>
                {title}
              </Text>
            </>
          )}
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons name='chevron-down' size={24} color={colors.primary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View layout={LinearTransition.springify()} style={{ overflow: 'hidden' }}>
        {isExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            layout={LinearTransition.springify()}
            className='px-3 mt-1'
            style={{ backgroundColor: colors.card }}
          >
            {children}
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  )
}
