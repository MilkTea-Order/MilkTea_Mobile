import React from 'react'
import { ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

interface AnimatedLogoContainerProps {
  size?: number
  isDark: boolean
  colors: {
    surface: string
    border: string
    primary: string
  }
  style?: ViewStyle
  children: React.ReactNode
}

export function AnimatedLogoContainer({ size = 110, isDark, colors, style, children }: AnimatedLogoContainerProps) {
  const scale = useSharedValue(1)

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  return (
    <Animated.View
      className='rounded-full items-center justify-center mb-5'
      style={[
        {
          width: size,
          height: size,
          backgroundColor: isDark ? `${colors.surface}CC` : `${colors.surface}E6`,
          borderWidth: 1,
          borderColor: isDark ? `${colors.border}80` : `${colors.border}B3`,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10
        },
        animatedStyle,
        style
      ]}
    >
      {children}
    </Animated.View>
  )
}
