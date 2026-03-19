import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

interface AnimatedOrbProps {
  size: number
  position: { top?: number; bottom?: number; left?: number; right?: number }
  gradientColors: [string, string]
  isDark: boolean
  delay?: number
}

export function AnimatedOrb({ size, position, gradientColors, isDark, delay = 0 }: AnimatedOrbProps) {
  const translateY = useSharedValue(0)

  React.useEffect(() => {
    const duration = 3000 + delay
    translateY.value = withRepeat(
      withSequence(
        withTiming(15, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    )
  }, [delay, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  return (
    <Animated.View
      className='absolute rounded-full'
      style={[
        {
          width: size,
          height: size,
          ...position,
          opacity: isDark ? 0.2 : 0.15
        },
        animatedStyle
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        style={{ flex: 1, borderRadius: 999 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  )
}
