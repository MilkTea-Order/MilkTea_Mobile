import { useTheme } from '@/shared/hooks/useTheme'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import Logo from '~/assets/images/logo.svg'

interface SplashScreenProps {
  isVisible?: boolean
}

export function SplashScreen({ isVisible = true }: SplashScreenProps) {
  const { colors } = useTheme()
  const rotation = useSharedValue(0)
  const rotationReverse = useSharedValue(0)
  const opacity = useSharedValue(1)

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear
      }),
      -1,
      false
    )
    rotationReverse.value = withRepeat(
      withTiming(-360, {
        duration: 1500,
        easing: Easing.linear
      }),
      -1,
      false
    )
  }, [rotation, rotationReverse])

  // Fade out animation when isVisible becomes false
  useEffect(() => {
    if (!isVisible) {
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease)
      })
    } else {
      opacity.value = 1
    }
  }, [isVisible, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    }
  })

  const animatedStyleReverse = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationReverse.value}deg` }]
    }
  })

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  return (
    <Animated.View
      className='absolute inset-0 items-center justify-center'
      style={[{ backgroundColor: colors.background }, fadeStyle]}
      pointerEvents={opacity.value > 0 ? 'auto' : 'none'}
    >
      {/* Outer Spinning Circle */}
      <View className='absolute items-center justify-center'>
        <Animated.View
          style={[
            {
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 3,
              borderColor: colors.primary,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              opacity: 0.6
            },
            animatedStyle
          ]}
        />
      </View>

      {/* Inner Spinning Circle (counter-clockwise) */}
      <View className='absolute items-center justify-center'>
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: colors.primary,
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              opacity: 0.4
            },
            animatedStyleReverse
          ]}
        />
      </View>

      {/* Logo */}
      <View className='items-center justify-center'>
        <Logo width={100} height={100} />
      </View>
    </Animated.View>
  )
}
