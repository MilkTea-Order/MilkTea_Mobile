import { MARGIN_FAB, SIZE_FAB } from '@/shared/constants/other'
import React, { useEffect } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { EdgeInsets } from 'react-native-safe-area-context'

export type FloatingPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center-bottom'

export interface FloatingButtonProps {
  children: React.ReactNode
  onPress?: () => void
  container: {
    width: number
    height: number
  }
  defaultPosition?: FloatingPosition | { x: number; y: number }
  insets?: EdgeInsets
}

export default function FloatingButton({ children, onPress, container, defaultPosition, insets }: FloatingButtonProps) {
  const width = container.width
  const height = container.height

  const getDefaultCoords = () => {
    if (!defaultPosition) {
      return {
        x: width - SIZE_FAB - MARGIN_FAB,
        y: height - SIZE_FAB - MARGIN_FAB
      }
    }

    const pos = defaultPosition as { x: number; y: number } | FloatingPosition

    if (typeof pos === 'object') {
      return { x: pos.x, y: pos.y }
    }

    switch (pos) {
      case 'bottom-left':
        return { x: MARGIN_FAB, y: height - SIZE_FAB - MARGIN_FAB }
      case 'top-right':
        return { x: width - SIZE_FAB - MARGIN_FAB, y: MARGIN_FAB }
      case 'top-left':
        return { x: MARGIN_FAB, y: MARGIN_FAB }
      case 'center-bottom':
        return { x: (width - SIZE_FAB) / 2, y: height - SIZE_FAB - MARGIN_FAB }
      case 'bottom-right':
      default:
        return { x: width - SIZE_FAB - MARGIN_FAB, y: height - SIZE_FAB - MARGIN_FAB }
    }
  }

  const defaultCoords = getDefaultCoords()
  const x = useSharedValue(defaultCoords.x)
  const y = useSharedValue(defaultCoords.y)

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

      x.value = Math.min(Math.max(nextX, MARGIN_FAB), width - SIZE_FAB - MARGIN_FAB)

      y.value = Math.min(Math.max(nextY, MARGIN_FAB), height - SIZE_FAB - MARGIN_FAB)
    })
    .onEnd(() => {
      const snapX = x.value > width / 2 ? width - SIZE_FAB - MARGIN_FAB : MARGIN_FAB

      x.value = withSpring(snapX, {
        damping: 15,
        stiffness: 120
      })
    })

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateX: x.value }, { translateY: y.value }]
  }))

  useEffect(() => {
    if (width && height) {
      const coords = getDefaultCoords()
      x.value = coords.x
      y.value = coords.y
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height])
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  )
}
