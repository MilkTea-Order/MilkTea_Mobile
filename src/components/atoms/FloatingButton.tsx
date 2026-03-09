import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const SIZE = 84
const MARGIN = 24

export interface FloatingButtonProps {
  children: React.ReactNode
  onPress?: () => void
  container: {
    width: number
    height: number
  }
}

export default function FloatingButton({ children, onPress, container }: FloatingButtonProps) {
  const width = container.width
  const height = container.height

  const x = useSharedValue(width - SIZE - MARGIN)
  const y = useSharedValue(height - SIZE - MARGIN)

  const startX = useSharedValue(0)
  const startY = useSharedValue(0)

  const gesture = Gesture.Pan()
    .minDistance(3)
    .onBegin(() => {
      startX.value = x.value
      startY.value = y.value
    })
    .onUpdate((e) => {
      const nextX = startX.value + e.translationX
      const nextY = startY.value + e.translationY

      x.value = Math.min(Math.max(nextX, MARGIN), width - SIZE - MARGIN)

      y.value = Math.min(Math.max(nextY, MARGIN), height - SIZE - MARGIN)
    })
    .onEnd(() => {
      const snapX = x.value > width / 2 ? width - SIZE - MARGIN : MARGIN

      x.value = withSpring(snapX, {
        damping: 15,
        stiffness: 120
      })
    })

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateX: x.value }, { translateY: y.value }]
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  )
}
